import { USERS } from "@/cache/users";
import { CVV } from "@/services/cvv";
import { Grade, User } from "@/types";
import express from "express";

const loginRoute = express();

loginRoute.get("/login", async (req, res) => {
  try {
    const { username, password } = req.query;

    if (!username || !password) {
      res.status(400).json({ error: "Missing username or password" });
      return;
    }

    const strUsername = username.toString();
    const strPass = password.toString();

    const cvv = new CVV();
    await cvv.login(strUsername, strPass);
    const latestGrades: Grade[] = (await cvv.getGrades()) || [];

    const user: User = {
      id: strUsername,
      prevGrades: latestGrades,
      cvv,
    };
    USERS.push(user);

    console.log(`${cvv.name} logged in`);

    res.json({ success: true });
  } catch (e) {
    res.json({ success: false });
  }
});

export default loginRoute;
