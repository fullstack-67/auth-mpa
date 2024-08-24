import "dotenv/config";
import Debug from "debug";
import { ExpressAuth } from "@auth/express";
import express from "express";

import { authConfig } from "./authConfig.js";
const debug = Debug("fs-auth");
const app = express();

// If your app is served through a proxy
// trust the proxy to allow us to read the `X-Forwarded-*` headers
app.set("trust proxy", true);
app.use("/auth/*", ExpressAuth(authConfig));

// * Running app
const PORT = 5001;
app.listen(PORT, async () => {
  debug(`Listening on port ${PORT}: http://localhost:${PORT}`);
});
