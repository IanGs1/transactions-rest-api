import path from "node:path";

import { Knex, knex as setupKnex } from "knex";

export const config: Knex.Config = {
  client: "sqlite3",
  connection: {
    filename: path.resolve(__dirname, "..", "database.db"),
  },
  migrations: {
    directory: path.resolve(__dirname, ".", "migrations"),
    extension: "ts",
  },
  useNullAsDefault: true,
}

export const knex = setupKnex(config);