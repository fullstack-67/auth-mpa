import "dotenv/config";
import Debug from "debug";
import bcrypt from "bcrypt";

const debug = Debug("app");

async function comparePassword(password: string, hash: string) {
  const result = await new Promise((resolve, reject) => {
    bcrypt.compare(password, hash, function (err, result) {
      if (err) reject(err);
      resolve(result);
    });
  });

  debug(result);
}

const hashes = [
  "$2b$04$urfsRT3oV1Lg24ydN9Jzvu6e9N/Rhc6lIpfdHNYJQE2GQab.VBzaW",
  "$2b$04$GaqJzGmhwFZtqspzg7V06ORX3qUeCcLWzh6CcaYobdxmguvQGwuf2",
  "$2b$04$UYA/9pDWqDcUQ1ZgQ1BGPuNZjSS2S8ryM96hggTGtPrAlVxlq8/oy",
  "$2b$04$AxO5LlT.xpCT43eHhRj5/.ChDC.wuQ.jabjBih2NXMW/vjR1c0MhK",
  "$2b$05$B3vPKHSnqfFDuyKL112Qf.xBQY3ek/noTjFWkBkH9SXEj1tj3.dS.",
  "$2b$06$y9ZZf.fJ.rYkB1Ov7FaNs.TrSdZxggEwbp9vdn9i5TGv1GRMq7w6O",
  "$2b$07$yzae/VmQbKiMjewQpGdM..N2HDL4J4WLEOy3Jk/HHJkb4IdTSMxya",
  "$2b$08$ybvwNizeajYdQzxV2I63yuW.PTDCTOlMFZkmMmikIDBOZAJ91R2GK",
  "$2b$09$pRq8J46TuMX3lruAWUrza.LbtaL9oG.P4rjh.fcX5BeYJ73GP.bnq",
  "$2b$10$vkZBkmZUSmcgIBBLfadDte7tapQndK0LAKBSDMUuXtiKV5SW5nz3K",
  "$2b$11$gODPjMuDscDqSxyD4VxA2.JjtC/tSzA0Trc6qv9l9w.Hw5.wHZK0i",
  "$2b$12$iQsrhGUudiHMM2ZOGQs5meQy4.AR5pTdW72ANN8vh6PscuuowLtlC",
  "$2b$13$OPFVhjwHXnfDAcbVmSFL6.YpTHqN8lTP0pH/nhU4zjuhlr60Bn0CC",
  "$2b$14$iFk7jZkyduejhHlC/ilgmuJ6g0A5lr51vn/pgKuLgEddJCSA02xzO",
  "$2b$15$R15bjLGOoHwWtQeDmnXCzOQ3FzftJqh58KXL/jfl8lKLOhpRPe9Wq",
];

async function main() {
  for (let hash of hashes) {
    await comparePassword("1234", hash);
  }
}
main();
