import { USERS } from "@/cache/users";
import { CVV } from "@/services/cvv";
import { Grade, User } from "@/types";
import express from "express";

const loginRoute = express();

loginRoute.get("/login", async (req, res) => {
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

  USERS.push(user);

  res.json({ success: true });
});

export default loginRoute;
