import TelegramBot from "node-telegram-bot-api";
import { CVV } from "./services/cvv";
import { Grade, User } from "./types";
import {
  addAwaitingLogin,
  addSubscribedGradeUser,
  addUser,
  getUser,
  isAwaitingLogin,
  removeAwaitingLogin,
  removeSubscribedGradeUser,
  removeUser,
} from "./cache/users";
import { HELP_MESSAGE, TELEGRAM_BOT_COMMANDS } from "./bot/commands";

const token = process.env.TELEGRAM_BOT_API as string;
export const TG_BOT = new TelegramBot(token, { polling: true });

export const startBot = () => {
  console.log("BOT ONLINE");

  TG_BOT.on("message", async msg => {
    const chatId = msg.chat.id;
    const message = msg.text?.toLocaleLowerCase();

    if (!message) return;

    // Check if user is about to type login info
    if (isAwaitingLogin(chatId)) {
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

        addUser(user);

        TG_BOT.sendMessage(
          chatId,
          `Sucesfully logged in as ${cvv.name}! Type ${TELEGRAM_BOT_COMMANDS.SUBSCRIBE_GRADES} to subscribe to grade notifications.`
        );
      } catch (err) {
        TG_BOT.sendMessage(chatId, `Something went wrong, is you username and password correct?`);
      } finally {
        // Remove from awaiting logins
        removeAwaitingLogin(chatId);

        // Exit
        return;
      }
    }

    switch (message) {
      // START
      case "/start": {
        TG_BOT.sendMessage(chatId, HELP_MESSAGE);
        break;
      }

      // HELP
      case TELEGRAM_BOT_COMMANDS.HELP: {
        TG_BOT.sendMessage(chatId, HELP_MESSAGE);
        break;
      }

      // INFO
      case TELEGRAM_BOT_COMMANDS.INFO: {
        const user = getUser(chatId);
        if (!user) {
          TG_BOT.sendMessage(chatId, `Status: not logged in.`);
          return;
        }
        TG_BOT.sendMessage(chatId, `Status: logged in as ${user.cvv.name}.`);
        break;
      }

      // LOGIN
      case TELEGRAM_BOT_COMMANDS.LOGIN: {
        if (isAwaitingLogin(chatId)) return;
        TG_BOT.sendMessage(chatId, `Welcome! send your username and password separated by comma to login.`);
        addAwaitingLogin(chatId);
        break;
      }

      // LOGOUT
      case TELEGRAM_BOT_COMMANDS.LOGOUT: {
        const user = getUser(chatId);
        if (!user) {
          TG_BOT.sendMessage(chatId, `No user logged in.`);
          return;
        }
        removeUser(user);
        TG_BOT.sendMessage(chatId, `Sucesfully logged out from ${user.cvv.name}.`);
        break;
      }

      // SUBSCRIBE GRADES
      case TELEGRAM_BOT_COMMANDS.SUBSCRIBE_GRADES: {
        const user = getUser(chatId);
        if (user) {
          addSubscribedGradeUser(user);
          TG_BOT.sendMessage(chatId, `${user.cvv.name} is now subscribed to grade notifications!`);
        } else {
          TG_BOT.sendMessage(chatId, `Run ${TELEGRAM_BOT_COMMANDS.LOGIN} first!`);
          return;
        }
        break;
      }

      // UNSUBSCRIBE GRADES
      case TELEGRAM_BOT_COMMANDS.UNSUBSCRIBE_GRADES: {
        const user = getUser(chatId);
        if (user) {
          removeSubscribedGradeUser(user);
          TG_BOT.sendMessage(chatId, `${user.cvv.name} is now unsubscribed from grade notifications!`);
        } else {
          TG_BOT.sendMessage(chatId, `No user logged in.`);
          return;
        }
        break;
      }

      default: {
        TG_BOT.sendMessage(chatId, `Command not found.`);
        break;
      }
    }
  });
};
