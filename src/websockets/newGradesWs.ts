import { PollingWebsocket } from "client-websockets";
import { findNewGrades } from "@/utils/findNewGrades";
import { Grade, User } from "@/types";
import { SUBSCRIBED_GRADES_USERS } from "@/cache/users";
import { TG_BOT } from "@/bot";
import { GRADES_POLLING_INTERVAL } from "@/constants";
import { wait } from "@/utils";

type WS_EVENT = {
  user: User;
  newGrade: Grade;
};

export const newGradesWesocket = new PollingWebsocket<WS_EVENT>({
  nameIdentifier: "Grades websocket",
  pollingInterval: GRADES_POLLING_INTERVAL,
  pollingFunction: async () => {
    try {
      for (const user of SUBSCRIBED_GRADES_USERS) {
        try {
          console.log(`Polling ${user.cvv.name} grades`);

          const grades = await user.cvv.getGrades();
          // Add a delay to avoid getting banned
          await wait(2000);

          if (!grades) continue;

          // Probably session cookie expired and grades are incorrect
          if (user.prevGrades.length > 0 && grades.length == 0) {
            user.cvv.login();
            continue;
          }

          const newGrades = findNewGrades(user.prevGrades, grades);

          user.prevGrades = grades;

          newGrades.forEach(grade => {
            const event: WS_EVENT = {
              newGrade: grade,
              user,
            };

            newGradesWesocket.send(event);
          });
        } catch (e) {
          console.log("Error while polling grades");
          console.log(e);
        }
      }
    } catch (e) {
      console.log(e);
    }
  },
});

newGradesWesocket.onMessage(event => {
  TG_BOT.sendMessage(event.user.chatId, `You got a new grade in ${event.newGrade.materia}: ${event.newGrade.voto}`);
});
