import { User } from "@/types";

const USERS: User[] = [];

export const addUser = (user: User) => {
  USERS.push(user);
};

export const removeUser = (user: User) => {
  USERS.splice(USERS.indexOf(user), 1);
};

export const getUser = (chatId: number) => {
  return USERS.find(user => user.chatId == chatId);
};

const SUBSCRIBED_GRADES_USERS: User[] = [];

export const addSubscribedGradeUser = (user: User) => {
  SUBSCRIBED_GRADES_USERS.push(user);
};

export const removeSubscribedGradeUser = (user: User) => {
  SUBSCRIBED_GRADES_USERS.splice(SUBSCRIBED_GRADES_USERS.indexOf(user), 1);
};

export const isSubscribedGrades = (user: User) => {
  return SUBSCRIBED_GRADES_USERS.includes(user);
};

const AWAITING_LOGINS: number[] = [];

export const addAwaitingLogin = (chatId: number) => {
  AWAITING_LOGINS.push(chatId);
};

export const isAwaitingLogin = (chatId: number) => {
  return AWAITING_LOGINS.includes(chatId);
};

export const removeAwaitingLogin = (chatId: number) => {
  AWAITING_LOGINS.splice(AWAITING_LOGINS.indexOf(chatId), 1);
};
