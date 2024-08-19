// https://stackoverflow.com/a/65805410

declare module "express-session" {
  interface SessionData {
    userId: string;
    count: number;
  }
}

export {};
