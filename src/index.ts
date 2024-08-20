import "dotenv/config";
import express from "express";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { dbClient } from "@db/client.js";
import { usersTable } from "@db/schema.js";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";

const app = express(); // Intializing the express app
app.set("view engine", "pug");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
// * Passort setup
passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async function (email, password, done) {
      const query = await dbClient.query.usersTable.findFirst({
        where: eq(usersTable.email, email),
      });
      if (!query) done(null, false, { message: "No email exists" });
      bcrypt.compare(password, query?.password ?? "", function (err, result) {
        if (err) done(err, false);
        if (result) {
          return done(null, query);
        } else {
          return done(null, false, { message: "Incorrect Password" });
        }
      });
    }
  )
);
app.use(passport.initialize());

// * Endpoints
app.get("/", async (req, res, next) => {
  res.render("pages/index", {
    title: "Home",
    user: req.user,
  });
});

app.get("/signup", function (req, res) {
  res.render("pages/signup", {
    title: "Signup",
  });
});

async function createUser(name: string, email: string, password: string) {
  const saltRounds = 10;
  let hashedPassword = "";
  hashedPassword = await new Promise((resolve, reject) => {
    bcrypt.hash(password, saltRounds, function (err, hash) {
      if (err) reject(err);
      resolve(hash);
    });
  });
  await dbClient
    .insert(usersTable)
    .values({
      name,
      email,
      isAdmin: false,
      password: hashedPassword,
      avatarURL: "logos/robot.png",
    })
    .returning({ id: usersTable.id });
}

app.post("/signup", async function (req, res) {
  // console.log(req.body);
  const name = req.body?.name ?? "";
  const email = req.body?.email ?? "";
  const password = req.body?.password ?? "";
  const passwordConfirm = req.body?.passwordConfirm ?? "";

  if (password !== passwordConfirm)
    res.status(401).send("Passwords not matched.");

  try {
    await createUser(name, email, password);
    res.setHeader("HX-Redirect", "/login");
    res.send(`<div></div>`);
  } catch (err: any) {
    console.log(err);
    res.status(500).send(err?.message ?? "Something wrong");
  }
});

app.get("/login", function (req, res) {
  res.render("pages/login", {
    title: "Login",
  });
});

app.post(
  "/login",
  passport.authenticate("local", { session: false }),
  function (req, res) {
    res.send(`<span>Login Successfully</span>`);
  }
);

// * Running app
const PORT = 5001;
app.listen(PORT, async () => {
  console.log(`Listening on port ${PORT}`);
  console.log(`http://localhost:${PORT}`);
});
