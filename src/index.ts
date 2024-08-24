import "dotenv/config";
import Debug from "debug";
import { ExpressAuth } from "@auth/express";
import express from "express";
import { currentSession } from "./auth/middlewares.js";
import { authConfig } from "./auth/authConfig.js";
import setupCommonMiddleWares from "./middlewares.js";

const debug = Debug("fs-auth");
const app = express();
setupCommonMiddleWares(app);

// * AuthJS
app.set("trust proxy", true); // If your app is served through a proxy, trust the proxy to allow us to read the `X-Forwarded-*` headers
app.use("/auth/*", ExpressAuth(authConfig));
app.use(currentSession);

app.get("/", async (req, res, next) => {
  const user = res.locals.session?.user ?? null;

  res.render("pages/index", {
    title: "Home",
    user: user,
  });
});

// * Running app
const PORT = 5001;
app.listen(PORT, async () => {
  debug(`Listening on port ${PORT}: http://localhost:${PORT}`);
});
