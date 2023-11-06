export const TELEGRAM_BOT_COMMANDS = {
  HELP: "/help",
  INFO: "/info",
  LOGIN: "/login",
  LOGOUT: "/logout",
  GRADES: "/grades",
  SUBSCRIBE_GRADES: "/subscribegrades",
  UNSUBSCRIBE_GRADES: "/unsubscribegrades",
} as const;

export const TELEGRAM_BOT_COMMANDS_DESCRIPTION: {
  [key in keyof typeof TELEGRAM_BOT_COMMANDS]: string;
} = {
  HELP: "Show list of available commands.",
  INFO: "Show info about your account.",
  LOGIN: "Login to your classeviva account.",
  LOGOUT: "Logout from your classeviva account.",
  GRADES: "Show your grades.",
  SUBSCRIBE_GRADES: "Subscribe to grades notifications.",
  UNSUBSCRIBE_GRADES: "Unsubscribe from grades notifications.",
} as const;

export const HELP_MESSAGE = `Possible commands:
${Object.entries(TELEGRAM_BOT_COMMANDS_DESCRIPTION)
  .map(
    ([command, description]) =>
      `${TELEGRAM_BOT_COMMANDS[command as keyof typeof TELEGRAM_BOT_COMMANDS]} - ${description}`
  )
  .join("\n")}`;
