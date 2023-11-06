// import { SUBSCRIBED_USERS, USERS } from "@/cache/users";
// import express from "express";

// const subscribeRoute = express();

// subscribeRoute.get("/subscribe", async (req, res) => {
//   try {
//     const { username } = req.query;

//     if (!username) {
//       res.status(400).json({ error: "Missing username" });
//       return;
//     }

//     const user = USERS.find(user => user.id == username);
//     if (!user) {
//       res.status(400).json({ error: "Login before subscribing" });
//       return;
//     }

//     SUBSCRIBED_USERS.push(user);

//     res.json({ success: true });
//   } catch (e) {
//     res.json({ success: false });
//   }
// });

// export default subscribeRoute;
