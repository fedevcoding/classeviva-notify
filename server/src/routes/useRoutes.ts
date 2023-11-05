import Express from "express";
import cors from "cors";

import loginRoute from "./login";

export const useRoutes = (app: Express.Application) => {
  app.use(cors({ origin: "*" }));
  app.use(loginRoute);
};
