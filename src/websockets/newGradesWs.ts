import { PollingWebsocket } from "ts-websockets";
import { findNewGrades } from "@/utils/findNewGrades";
import { Grade, User } from "@/types";
import { SUBSCRIBED_USERS } from "@/cache/users";
import { TG_BOT } from "@/bot";

type WS_EVENT = {
  user: User;
  newGrade: Grade;
};

export const newGradesWesocket = new PollingWebsocket<WS_EVENT>({
  nameIdentifier: "Grades websocket",
  pollingInterval: 3000, // Every minute
  pollingFunction: async () => {
    try {
      SUBSCRIBED_USERS.forEach(async user => {
        console.log(`Polling ${user.cvv.name} grades`);

        const grades = await user.cvv.getGrades();
        if (!grades) return;
        const newGrades = findNewGrades(user.prevGrades, grades);

        user.prevGrades = grades;

        newGrades.forEach(grade => {
          const event: WS_EVENT = {
            newGrade: grade,
            user,
          };

          newGradesWesocket.send(event);
        });
      });
    } catch (e) {
      console.log(e);
    }
  },
});

newGradesWesocket.onMessage(event => {
  TG_BOT.sendMessage(event.user.chatId, `You got a new grade: ${event.newGrade.voto}!`);
});