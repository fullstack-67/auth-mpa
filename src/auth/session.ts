import "dotenv/config";
import session from "express-session";
import connect from "connect-sqlite3";

const SQLiteStore = connect(session);
const SQLiteStoreInstance = new SQLiteStore({
  db: "./db.sqlite",
  table: "sessions",
});

const sessionIns = session({
  secret: "My Super Secret",
  saveUninitialized: false,
  resave: false,
  store: SQLiteStoreInstance as session.Store,
});

export default sessionIns;
