require("module-alias/register");

import dotenv from "dotenv";
dotenv.config();

import { connectWebsockets } from "./main";
import { startBot } from "./bot";

connectWebsockets();
startBot();
