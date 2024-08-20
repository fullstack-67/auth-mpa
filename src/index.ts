import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import sessionIns, {
  setSessionInfoAfterLogin,
  formatSession,
} from "./auth/session.js";
import passportIns from "./auth/passport.js";
import * as useragent from "express-useragent";
import { deleteSession, createUser } from "@db/repositories.js";
import { PORT, NODE_ENV } from "./utils/env.js";

const app = express(); // Intializing the express app
app.set("view engine", "pug");
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // Extracts the entire body portion of an incoming request stream and exposes it on req.body.
app.use(express.static("public"));
app.use(morgan("dev"));
const scriptSources = ["'self'", "https://unpkg.com"];
const styleSources = ["'self'", "'unsafe-inline'", "cdn.jsdelivr.net"];
const connectSources = ["'self'"];
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        scriptSrc: scriptSources,
        scriptSrcElem: scriptSources,
        styleSrc: styleSources,
        connectSrc: connectSources,
      },
      reportOnly: true,
    },
  })
);
app.use(
  cors({
    origin: false, // Disable CORS
    // origin: "*", // Allow all origins
  })
);
app.use(useragent.express());

// * Session
if (NODE_ENV === "production") app.set("trust proxy", 1); // trust first proxy
app.use(sessionIns);
app.use(passportIns.initialize());
app.use(passportIns.session());

// * Endpoints
app.get("/", async (req, res, next) => {
  console.log("----------/--------------");
  console.dir({
    session: req.session,
    user: req.user,
    sessionID: req.sessionID,
  });
  const sessions = await formatSession(req);
  res.render("pages/index", {
    title: "Home",
    user: req.user,
    sessions: sessions,
  });
});

app.get("/signup", function (req, res) {
  res.render("pages/signup", {
    title: "Signup",
  });
});

app.post("/signup", async function (req, res, next) {
  console.log(req.body);
  const name = req.body?.name ?? "";
  const email = req.body?.email ?? "";
  const password = req.body?.password ?? "";
  const passwordConfirm = req.body?.passwordConfirm ?? "";

  if (password !== passwordConfirm) {
    res.status(401).send("Passwords not matched.");
    return next(); // If I don't return, the function will continue executing.
  }

  try {
    await createUser(name, email, password);
    res.setHeader("HX-Redirect", "/login");
    res.send(`<div></div>`);
  } catch (err: any) {
    console.log(err);
    res.status(500).send(err?.message ?? "Something wrong");
    return next();
  }
});

app.get("/login", function (req, res) {
  res.render("pages/login", {
    title: "Login",
  });
});

app.post("/login", passportIns.authenticate("local"), function (req, res) {
  console.log("----------Login--------------");
  // console.log(req.body);
  // console.log(req.session);
  setSessionInfoAfterLogin(req, "CREDENTIAL");
  res.setHeader("HX-Redirect", "/");
  res.send(`<div></div>`);
});

app.get("/login/oauth/github", passportIns.authenticate("github"));

app.get(
  "/callback/github",
  passportIns.authenticate("github", { failureRedirect: "/login" }),
  function (req, res) {
    console.log("----------Callback--------------");
    setSessionInfoAfterLogin(req, "GITHUB");
    res.redirect("/");
  }
);

app.get("/login/oauth/google", passportIns.authenticate("google"));

app.get(
  "/callback/google",
  passportIns.authenticate("google", { failureRedirect: "/login" }),
  function (req, res) {
    console.log("----------Callback--------------");
    setSessionInfoAfterLogin(req, "GOOGLE");
    res.redirect("/");
  }
);

app.post("/logout", function (req, res, next) {
  // req.logout will not delete the session in db. It will generate new one for the already-logout user.
  // When the user login again, it will generate new session with the user id.
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    // If you want to delete the session in DB, you can use this function.
    req.session.destroy(function (err) {
      if (err) {
        return next(err);
      }
      res.setHeader("HX-Redirect", "/");
      res.send("<div></div>");
    });
  });
});

app.delete("/session", async function (req, res, next) {
  const sid = (req?.query?.sid ?? "") as string;
  const request = await deleteSession(sid);
  res.setHeader("HX-Redirect", "/");
  res.send(`<div></div>`);
});

// * Running app
app.listen(PORT, async () => {
  console.log(`Listening on port ${PORT}`);
  console.log(`http://localhost:${PORT}`);
});
