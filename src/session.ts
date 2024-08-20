import "dotenv/config";
import session from "express-session";
import connect from "connect-sqlite3";
import { type Request } from "express";
import dayjs from "dayjs";
import { getAllSessions } from "@db/repositories.js";
import { type Details } from "express-useragent";
import { NODE_ENV } from "@src/utils/env.js";

const SQLiteStore = connect(session);
const SQLiteStoreInstance = new SQLiteStore({
  db: "./db.sqlite",
  table: "sessions",
});

const sessionIns = session({
  secret: "My Super Secret",
  cookie: {
    path: "/",
    httpOnly: true,
    secure: NODE_ENV === "production" ? true : false,
    maxAge: 60 * 60 * 1000,
    sameSite: "lax",
  },
  saveUninitialized: false,
  resave: false,
  store: SQLiteStoreInstance as session.Store,
});

export default sessionIns;

export function setSessionInfo(req: Request) {
  if (req.useragent) {
    req.session.useragent = req.useragent;
    req.session.createdAt = new Date().getTime();
  }
}

export async function formatSession(req: Request) {
  const sessions = await getAllSessions();

  const sessionsMod = sessions?.map((session) => {
    const sess = session.sess as any;
    const createdAt = (sess?.createdAt ?? new Date().getTime()) as number;
    const dt = dayjs(createdAt);
    const useragent = (sess?.useragent ?? null) as Details | null;
    const useragentStr = useragent
      ? `${useragent.browser} - ${useragent.os}`
      : "Unknown Source";
    return {
      ...session,
      isOwnSession: session.sid === req.sessionID,
      createdAtStr: dt.format("DD/MM/YYYY HH:mm:ss"),
      createdAtDt: dt,
      useragentStr: useragentStr,
    };
  });

  return sessionsMod;
}
