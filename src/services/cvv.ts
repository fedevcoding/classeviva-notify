import { RELOGIN_INTERVAL } from "@/constants";
import { Grade } from "@/types";
import { parseGrades } from "@/utils/parseGrades";
import axios from "axios";
import FormData from "form-data";

const URLS = {
  LOGIN: "https://web.spaggiari.eu/auth-p7/app/default/AuthApi4.php?a=aLoginPwd",
  GRADES: "https://web.spaggiari.eu/cvv/app/default/genitori_note.php?ordine=data&filtro=tutto",
  // GRADES: "http://lohalhost:4000",
};

export class CVV {
  private loggedIn: boolean = false;
  public name: string | undefined;
  public surname: string | undefined;
  private sessionCookie: string | undefined;

  private username: string | undefined;
  private password: string | undefined;

  private loginInterval: NodeJS.Timeout | undefined;

  constructor() {}

  public isLoggedIn(): boolean {
    return this.loggedIn;
  }

  public async login(username: string, password: string): Promise<void> {
    // if (this.loggedIn) return;

    try {
      const data = new FormData();
      data.append("cid", "");
      data.append("uid", username);
      data.append("pwd", password);
      data.append("pin", "");
      data.append("target", "");

      const res = await axios.request({
        method: "post",
        url: URLS.LOGIN,
        headers: {
          ...data.getHeaders(),
        },
        data: data,
      });

      const cookie = res.headers?.["set-cookie"]?.[1]?.slice(0, 42);
      if (res?.data?.data?.auth?.verified && cookie) {
        this.username = username;
        this.password = password;

        if (!this.loginInterval) {
          this.loginInterval = setInterval(() => {
            this.login(this.username!, this.password!);
          }, RELOGIN_INTERVAL);
        }

        this.loggedIn = true;
        this.sessionCookie = cookie;

        this.name = res?.data?.data?.auth?.accountInfo?.nome;
        this.surname = res?.data?.data?.auth?.accountInfo?.cognome;

        console.log(`Logged in as ${this.name} ${this.surname}`);
      } else {
        throw new Error("Wrong username or password");
      }
    } catch (e) {
      console.log("Error while logging in");
      console.log(e);
      throw new Error("Error while logging in");
    }
  }

  public async getGrades(): Promise<Grade[] | undefined> {
    if (!this.loggedIn) return;

    try {
      const res = await axios.request({
        method: "get",
        url: URLS.GRADES,
        headers: {
          cookie: this.sessionCookie,
        },
      });

      const html = res.data;
      const grades = parseGrades(html);

      return grades;
    } catch (e) {
      console.log("Error while getting grades");
      console.log(e);
      return;
    }
  }

  public async logout(): Promise<void> {
    if (!this.loggedIn) return;
    if (this.loginInterval) {
      clearInterval(this.loginInterval);
    }
    this.sessionCookie = "";
    this.loggedIn = false;
  }

  get cookie(): string | undefined {
    return this.sessionCookie;
  }
}
