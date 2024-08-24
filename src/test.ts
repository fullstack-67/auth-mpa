import "dotenv/config";
import Debug from "debug";
import jwt from "jsonwebtoken";

const debugReal = Debug("app:real");
const debugFake = Debug("app:fake");

// * Load secret
const jwtSecret = process.env.JWT_SECRET ?? "";
if (!jwtSecret) throw new Error("No secret");

// * Signing
const tokenReal = jwt.sign({ name: "tom", role: "user" }, jwtSecret, {
  expiresIn: "1h",
});
const tokenFake = jwt.sign({ name: "tom", role: "admin" }, "FakeSecret", {
  expiresIn: "1h",
});
debugReal(`Real: ${tokenReal}`);
debugFake(`Fake: ${tokenFake}`);

// * Verifying
try {
  const decodedReal = jwt.verify(tokenReal, jwtSecret);
  debugReal(decodedReal);
} catch (err) {
  debugReal(err);
}

try {
  const decodedFake = jwt.verify(tokenFake, jwtSecret);
  debugFake(decodedFake);
} catch (err) {
  if (err instanceof jwt.JsonWebTokenError) {
    debugFake(err.message); // Give error here
  }
}
