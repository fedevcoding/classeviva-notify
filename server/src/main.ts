import { newGradesWesocket } from "./websockets/newGradesWs";

export const connectWebsockets = () => {
  newGradesWesocket.connect();
};
