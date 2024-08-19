import "dotenv/config";
import session from "express-session";
import connect from "connect-sqlite3";
import { nanoid } from "nanoid";
import { type Request } from "express";
const generateSessionKey = (req: Request) => {
  const userId = req.user?.id ?? "";
  const randomId = nanoid();
  return `session:${userId}:${randomId}`;
};

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
    secure: false,
    maxAge: 60 * 60 * 1000,
    sameSite: "lax",
  },
  saveUninitialized: false,
  resave: false,
  store: SQLiteStoreInstance as session.Store,
  genid: generateSessionKey,
});

export default sessionIns;
