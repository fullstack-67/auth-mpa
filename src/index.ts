import "dotenv/config";
import Debug from "debug";
import express from "express";
import passport from "passport";
import morgan from "morgan";
import { github, debug as debugGH } from "./passportOauthGithub.js";

const debug = Debug("fs-auth");
const app = express(); // Intializing the express app
app.set("view engine", "pug");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
app.use(morgan("dev", { immediate: true }));

// * Passport
passport.use("github", github);
app.use(passport.initialize());

// * Endpoints
app.get("/", async (req, res, next) => {
  let user: any = null;
  if (req?.query?.id) {
    user = req.query;
    user.isAdmin = user.isAdmin === "true" ? true : false; // Turn string into boolean
  }
  res.render("pages/index", {
    title: "Home",
    user: user,
  });
});

app.get("/login", function (req, res) {
  res.render("pages/login", {
    title: "Login",
  });
});

app.get("/login/oauth/github", passport.authenticate("github"));

app.get(
  "/callback/github",
  passport.authenticate("github", {
    failureRedirect: "/login",
    session: false,
  }),
  function (req, res) {
    debugGH("@callback handler");
    if (req?.user) {
      const params = new URLSearchParams(req.user as any);
      res.redirect(`/?${params.toString()}`);
    } else {
      res.redirect("/");
    }
  }
);

// * Running app
const PORT = 5001;
app.listen(PORT, async () => {
  debug(`Listening on port ${PORT}: http://localhost:${PORT}`);
});
