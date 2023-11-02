require("module-alias/register");

import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import { CVV } from "./services/cvv";

const port = process.env.PORT || 3000;
const app = express();
app.use(cors({ origin: "*" }));

const cvv = new CVV();

app.get("/login", (req, res) => {
  // cvv.login(username, password);

  res.send("Hello World!");
});

app.get("/grades", async (req, res) => {
  const grades = await cvv.getGrades();

  res.json(grades);
});

app.listen(port, async () => {
  console.log(`App listening at http://localhost:${port}`);
});
