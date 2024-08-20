import "dotenv/config";
import express from "express";
import sessionIns, { formatSession } from "./session.js";
import * as useragent from "express-useragent";
import { NODE_ENV } from "./utils/env.js";
import { setSessionInfo } from "./session.js";
import { deleteSession } from "@db/repositories.js";

const app = express(); // Intializing the express app
app.set("view engine", "pug");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
app.use(useragent.express());

// * Session
if (NODE_ENV === "production") app.set("trust proxy", 1); // trust first proxy
app.use(sessionIns);

// * Endpoints
app.get("/", async (req, res, next) => {
  console.dir({
    session: req.session,
    sessionID: req.sessionID,
  });
  setSessionInfo(req);
  const sessions = await formatSession(req);
  res.render("pages/index", {
    title: "Home",
    sessions: sessions,
  });
});

app.delete("/session", async function (req, res, next) {
  const sid = (req?.query?.sid ?? "") as string;
  const request = await deleteSession(sid);
  res.setHeader("HX-Redirect", "/");
  res.send(`<div></div>`);
});

// * Running app
const PORT = 5001;
app.listen(PORT, async () => {
  console.log(`Listening on port ${PORT}`);
  console.log(`http://localhost:${PORT}`);
});
