import "dotenv/config";
import Debug from "debug";
import bcrypt from "bcrypt";

const debug = Debug("app");

async function hashPassword(password: string, saltRounds: number) {
  // Promisify technique
  const hashedPassword = await new Promise((resolve, reject) => {
    bcrypt.hash(password, saltRounds, function (err, hash) {
      if (err) reject(err);
      resolve(hash);
    });
  });

  debug(`saltRounds=${saltRounds}, hash=${hashedPassword}`);
  // console.log(hashedPassword);
}

async function main() {
  for (let i = 1; i < 16; i++) {
    await hashPassword("1234", i);
  }
}
main();
