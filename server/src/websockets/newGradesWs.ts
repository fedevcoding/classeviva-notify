import { PollingWebsocket } from "ts-websockets";
import { users } from "..";
import { findNewGrades } from "@/utils/findNewGrades";
import { Grade } from "@/types";

export const newGradesWesocket = new PollingWebsocket<Grade>({
  nameIdentifier: "test",
  pollingInterval: 5000,
  pollingFunction: async () => {
    try {
      users.forEach(async user => {
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
