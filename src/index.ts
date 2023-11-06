require("module-alias/register");

import dotenv from "dotenv";
dotenv.config();

import { connectWebsockets } from "./main";
import { startBot } from "./bot";
connectWebsockets();
startBot();

// import express from "express";
// import { useRoutes } from "./routes/useRoutes";

// const port = process.env.PORT || 3000;
// const app = express();

// useRoutes(app);

// app.listen(port, async () => {
// console.log(`App listening at http://localhost:${port}`);
// });
