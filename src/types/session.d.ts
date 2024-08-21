import { type Details } from "express-useragent";
import { type LoginType } from "@src/session.ts";
// https://stackoverflow.com/a/65805410

declare module "express-session" {
  interface SessionData {
    useragent?: Details;
    createdAt?: number;
    count?: number;
    msg?: string;
  }
}

export {};
