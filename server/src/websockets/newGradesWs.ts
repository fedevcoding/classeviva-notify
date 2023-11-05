import { PollingWebsocket } from "ts-websockets";
import { findNewGrades } from "@/utils/findNewGrades";
import { Grade, User } from "@/types";
import { SUBSCRIBED_USERS } from "@/cache/users";

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
  console.log(`${event.user.cvv.name} GOT A NEW GRADE: ${event.newGrade.voto}!`);
});
