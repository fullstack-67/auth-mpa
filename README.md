# Auth-MPA - V2

- Multi-page app (using HTMX) to demonstrate authentical/authorization.

- Use `ESM` module.

## Note on installation

- The package `better-sqlite3` needs newest version of node (`V22` as of 2024-08-19).
- I cannot use `drizzle-kit` push.
  - I got `TypeError: This statement does not return data. Use run() instead.` error.
  - The solution is posted [here](https://github.com/drizzle-team/drizzle-orm/issues/2623#issuecomment-2233946827), but I will just do migration instead.

## Github

### Flow

https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/authorizing-oauth-apps#web-application-flow

### Login URL

- https://github.com/login/oauth/authorize?client_id=CLIENT_ID&redirect_uri=REDIRECT_URL&response_type=code&scope=user,user:email

### Resource

- https://docs.github.com/en/rest/users/users?apiVersion=2022-11-28#get-the-authenticated-user
- https://docs.github.com/en/rest/users/emails?apiVersion=2022-11-28#list-email-addresses-for-the-authenticated-user

# Google

### Flow

- https://developers.google.com/identity/protocols/oauth2/web-server#httprest_1

### Login

- https://accounts.google.com/o/oauth2/v2/auth?client_id=CLIENT_ID&redirect_uri=REDIRECT_URI&response_type=code&scope=openid+https://www.googleapis.com/auth/userinfo.email+https://www.googleapis.com/auth/userinfo.profile

### Resource

- https://developers.google.com/oauthplayground
- https://www.googleapis.com/oauth2/v2/userinfo
