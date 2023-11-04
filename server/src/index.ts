require("module-alias/register");

import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import { CVV } from "./services/cvv";
import { Grade, User } from "./types";
import { connectWebsockets } from "./main";

const port = process.env.PORT || 3000;
const app = express();
app.use(cors({ origin: "*" }));

export const users: User[] = [];

app.get("/login", async (req, res) => {
  const { username, password } = req.query;

  if (!username || !password) {
    res.status(400).json({ error: "Missing username or password" });
    return;
  }

  const cvv = new CVV();
  await cvv.login(username as string, password as string);
  const latestGrades: Grade[] = [];

  const user: User = {
    id: username as string,
    name: username as string,
    prevGrades: latestGrades,
    cvv,
  };

  users.push(user);

  res.json({ success: true });
});

// app.get("/grades", async (req, res) => {
//   const grades = await cvv.getGrades();
//   res.json(grades);
// });

app.listen(port, async () => {
  connectWebsockets();
  console.log(`App listening at http://localhost:${port}`);
});
