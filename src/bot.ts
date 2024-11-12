import TelegramBot from "node-telegram-bot-api";
import { CVV } from "./services/cvv";
import { Grade, User } from "./types";
import {
  addAwaitingLogin,
  addSubscribedGradeUser,
  addUser,
  getUser,
  isAwaitingLogin,
  isSubscribedGrades,
  removeAwaitingLogin,
  removeSubscribedGradeUser,
  removeUser,
} from "./cache/users";
import { HELP_MESSAGE, TELEGRAM_BOT_COMMANDS } from "./bot/commands";
import { env } from "./env";

export const TG_BOT = new TelegramBot(env.TELEGRAM_BOT_API, { polling: { interval: 1000 } });


export function startBot() {
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

        const strUsername = data[0].toString().trim();
        const strPass = data[1].toString().trim();

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
        const user = getUser(chatId);
        if (user) {
          TG_BOT.sendMessage(chatId, `You are already logged in as ${user.cvv.name}.`);
          return;
        }
        if (isAwaitingLogin(chatId)) return;
        TG_BOT.sendMessage(
          chatId,
          `To login type your username and password separated by COMMA (example: myusername, mypassword) - PAY ATTENTION TO THE FORMAT!`
        );
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

        user.cvv.logout();
        removeUser(user);
        TG_BOT.sendMessage(chatId, `Sucesfully logged out from ${user.cvv.name}.`);
        break;
      }

      // GRADES
      case TELEGRAM_BOT_COMMANDS.GRADES: {
        try {
          const user = getUser(chatId);
          if (!user) {
            TG_BOT.sendMessage(chatId, `No user logged in.`);
            return;
          }

          const grades = await user.cvv.getGrades();
          if (!grades) {
            TG_BOT.sendMessage(chatId, `Something went wrong, try again later.`);
            return;
          }

          const gradesString = grades.map(grade => `- ${grade.materia}: ${grade.voto}`).join("\n");
          TG_BOT.sendMessage(chatId, `- - - - - YOUR LATEST GRADES - - - - -\n\n${gradesString}`);
        } catch (err) {
          console.log("Error while getting grades");
          console.log(err);
          TG_BOT.sendMessage(chatId, `Something went wrong, try again later.`);
        } finally {
          break;
        }
      }

      // SUBSCRIBE GRADES
      case TELEGRAM_BOT_COMMANDS.SUBSCRIBE_GRADES: {
        const user = getUser(chatId);
        if (user) {
          const isSubGrades = isSubscribedGrades(user);
          if (isSubGrades) {
            TG_BOT.sendMessage(chatId, `${user.cvv.name} is already subscribed to grade notifications!`);
            return;
          }
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
          const isSubGrades = isSubscribedGrades(user);
          if (!isSubGrades) {
            TG_BOT.sendMessage(chatId, `${user.cvv.name} is not subscribed to grade notifications!`);
            return;
          }
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
}
