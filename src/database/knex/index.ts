import path from "node:path";

import { knex as setupKnex } from "knex";

export const knex = setupKnex({
  client: "sqlite3",
  connection: {
    filename: path.resolve(__dirname, "..", "database.db"),
  }
});