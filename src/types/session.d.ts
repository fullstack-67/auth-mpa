import * as useragent from "express-useragent";

// https://stackoverflow.com/a/65805410

declare module "express-session" {
  interface SessionData {
    useragent?: useragent.Details;
    createdAt?: number;
  }
}

export {};
