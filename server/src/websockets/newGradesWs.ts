import { PollingWebsocket } from "ts-websockets";
import { findNewGrades } from "@/utils/findNewGrades";
import { Grade } from "@/types";
import { USERS } from "@/cache/users";

export const newGradesWesocket = new PollingWebsocket<Grade>({
  nameIdentifier: "test",
  pollingInterval: 5000,
  pollingFunction: async () => {
    try {
      USERS.forEach(async user => {
        console.log("Polling...");
        const grades = await user.cvv.getGrades();
        if (!grades) return;
        const newGrades = findNewGrades(user.prevGrades, grades);

        user.prevGrades = grades;

        newGrades.forEach(grade => {
          newGradesWesocket.send(grade);
        });
      });
    } catch (e) {
      console.log(e);
    }
  },
});

newGradesWesocket.onMessage(grade => {
  console.log("YOU GOT A NEW GRADE!", grade.voto);
});
