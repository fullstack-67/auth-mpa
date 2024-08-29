import "dotenv/config";

const githubClientSecret = process.env.GITHUB_CLIENT_SECRET ?? "";
const githubClientID = process.env.GITHUB_CLIENT_ID ?? "";
const githubCallbackURL = process.env.GITHUB_CALLBACK_URL ?? "";
const githubTokenURL = process.env.GITHUB_TOKEN_URL ?? "";
const githubAuthorizationURL = process.env.GITHUB_AUTHORIZATION_URL ?? "";

if (
  !githubClientID ||
  !githubClientSecret ||
  !githubCallbackURL ||
  !githubTokenURL ||
  !githubAuthorizationURL
)
  throw new Error("Invalid ENV");

export const github = {
  githubClientID,
  githubClientSecret,
  githubCallbackURL,
  githubTokenURL,
  githubAuthorizationURL,
};
