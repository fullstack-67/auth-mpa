import { dbClient, dbConn } from "@db/client.js";
import { usersTable, accountsTable } from "@db/schema.js";
import bcrypt from "bcrypt";

const saltRounds = 10;
const password = "1234";

async function insertData() {
  bcrypt.hash(password, saltRounds, async function (err, hash) {
    const results = await dbClient
      .insert(usersTable)
      .values([
        {
          name: "Admin User",
          email: "admin@cmu.com",
          isAdmin: true,
          password: hash,
          avatarURL: "https://i.pravatar.cc/150?img=3",
        },
        {
          name: "Regular User",
          email: "user@cmu.com",
          isAdmin: false,
          password: hash,
          avatarURL: "https://i.pravatar.cc/150?img=4",
        },
        {
          name: "Nirand Pisutha-Arnond",
          email: "nnnpooh@gmail.com",
          isAdmin: true,
          password: hash,
          avatarURL: "https://i.pravatar.cc/150?img=5",
        },
      ])
      .returning({ id: usersTable.id });

    // console.log(results);

    dbConn.close();
  });
}

insertData();
