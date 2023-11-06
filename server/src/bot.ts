import TelegramBot from "node-telegram-bot-api";
import { CVV } from "./services/cvv";
import { Grade, User } from "./types";
import { SUBSCRIBED_USERS, USERS } from "./cache/users";

const token = process.env.TELEGRAM_BOT_API as string;
export const TG_BOT = new TelegramBot(token, { polling: true });

export const startBot = () => {
  const awaitingLogins: number[] = [];

  TG_BOT.on("message", async msg => {
    const chatId = msg.chat.id;
    const message = msg.text?.toLocaleLowerCase();

    if (!message) return;

    if (message === "/start") {
      TG_BOT.sendMessage(chatId, `Welcome! send /login to login to your CVV account.`);
    } else if (message === "/login") {
      if (awaitingLogins.includes(chatId)) return;
      TG_BOT.sendMessage(chatId, `Welcome! send your username and password separated by comma to login.`);
      awaitingLogins.push(chatId);
    } else if (awaitingLogins.includes(chatId)) {
      try {
        const data = msg.text?.split(",");

        if (!data) throw new Error("Wrong username or password.");

        const strUsername = data[0].toString();
        const strPass = data[1].toString();

        const cvv = new CVV();
        await cvv.login(strUsername, strPass);
        const latestGrades: Grade[] = (await cvv.getGrades()) || [];

        const user: User = {
          id: strUsername,
          prevGrades: latestGrades,
          cvv,
          chatId,
        };
        USERS.push(user);
        TG_BOT.sendMessage(
          chatId,
          `Sucesfully logged in as ${cvv.name}!, send /subscribe to subscribe to grade notifications.`
        );
      } catch (err) {
        TG_BOT.sendMessage(chatId, `Wrong username or password.`);
      } finally {
        awaitingLogins.splice(awaitingLogins.indexOf(chatId), 1);
      }
    } else if (message === "/help") {
    } else if (message === "/subscribe") {
      const isLogged = USERS.find(user => user.chatId == chatId);
      if (isLogged) {
        SUBSCRIBED_USERS.push(isLogged);
        TG_BOT.sendMessage(chatId, `You are now subscribed to grade notifications!`);
      } else {
        TG_BOT.sendMessage(chatId, `Run /login first!`);
        return;
      }
    } else {
      TG_BOT.sendMessage(chatId, `Command not found.`);
    }
  });
};
