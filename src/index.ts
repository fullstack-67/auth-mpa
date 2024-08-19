import "dotenv/config";
import express, { ErrorRequestHandler } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import sessionIns from "./auth/session.js";
import passportIns from "./auth/passport.js";
import { getAllUserSessions } from "@db/repositories.js";
import * as useragent from "express-useragent";

const app = express(); //Intializing the express app
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
app.use(sessionIns); // Session
app.use(passportIns.initialize());
app.use(passportIns.session());

app.get("/", async (req, res, next) => {
  console.log("----------/--------------");
  console.dir({
    session: req.session,
    user: req.user,
    sessionID: req.sessionID,
  });
  const sessions = await getAllUserSessions(req?.user?.id ?? "");
  res.render("pages/index", {
    title: "Home",
    user: req.user,
    sessions: sessions,
  });
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
  if (req.user && req.useragent) {
    req.session.useragent = req.useragent;
  }
  res.setHeader("HX-Redirect", "/");
  res.send(`<div></div>`);
});

app.get(
  "/login/oauth/github",
  passportIns.authenticate("github"),
  function (req, res) {
    console.log("----------Login Github--------------");
  }
);

app.get(
  "/callback/github",
  passportIns.authenticate("github", { failureRedirect: "/login" }),
  function (req, res) {
    console.log("----------Callback--------------");
    if (req.user && req.useragent) {
      req.session.useragent = req.useragent;
    }
    res.redirect("/");
  }
);

app.get(
  "/login/oauth/google",
  passportIns.authenticate("google"),
  function (req, res) {
    console.log("----------Login--------------");
  }
);

app.get(
  "/callback/google",
  passportIns.authenticate("google", { failureRedirect: "/login" }),
  function (req, res) {
    console.log("----------Callback--------------");
    if (req.user && req.useragent) {
      req.session.useragent = req.useragent;
    }
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

// Running app
const PORT = process.env.PORT || 5001;
app.listen(PORT, async () => {
  console.log(`Listening on port ${PORT}`);
  console.log(`http://localhost:${PORT}`);
});
