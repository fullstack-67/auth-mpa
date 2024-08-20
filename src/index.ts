import express from "express";
import passport from "passport";
import { github } from "./passportOauthGithub.js";
import { google } from "./passportOauthGoogle.js";

const app = express(); // Intializing the express app
app.set("view engine", "pug");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

passport.use("github", github);
passport.use("google", google);

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
    if (req?.user) {
      const params = new URLSearchParams(req.user as any);
      res.redirect(`/?${params.toString()}`);
    } else {
      res.redirect("/");
    }
  }
);

app.get("/login/oauth/google", passport.authenticate("google"));

app.get(
  "/callback/google",
  passport.authenticate("google", {
    failureRedirect: "/login",
    session: false,
  }),
  function (req, res) {
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
  console.log(`Listening on port ${PORT}`);
  console.log(`http://localhost:${PORT}`);
});
