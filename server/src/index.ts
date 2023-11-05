require("module-alias/register");

import dotenv from "dotenv";
dotenv.config();

import express from "express";
import { connectWebsockets } from "./main";
import { useRoutes } from "./routes/useRoutes";

const port = process.env.PORT || 3000;
const app = express();

useRoutes(app);

app.listen(port, async () => {
  connectWebsockets();
  console.log(`App listening at http://localhost:${port}`);
});
