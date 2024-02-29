import { Knex } from "knex";

import path from "node:path";

export = {
  client: "sqlite3",
  connection: path.resolve(__dirname, "src", "database", "database.db"),

  migrations: {
    directory: path.resolve(__dirname, "src", "database", "knex", "migrations"),
    extension: "ts",
  },

  useNullAsDefault: true,
} as Knex.Config