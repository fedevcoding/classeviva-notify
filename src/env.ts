import { str, envsafe, port, url } from "envsafe";

export const env = envsafe({
  NODE_ENV: str({
    devDefault: "development",
    choices: ["development", "production"],
  }),
  TELEGRAM_BOT_API: str({
    desc: "Telegram bot API key",
  }),
  PROXY_HOST: str({
    desc: "Proxy URL",
  }),
  PROXY_PORT: port({
    desc: "Proxy port",
  }),
  PROXY_USERNAME: str({
    desc: "Proxy username",
  }),
  PROXY_PASSWORD: str({
    desc: "Proxy password",
  }),
});
