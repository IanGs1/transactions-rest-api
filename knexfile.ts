import { Knex } from "knex";

import path from "node:path";
import env from "./src/env";

export = {
  client: "sqlite3",
  connection: env.DATABASE_URL,

  migrations: {
    directory: path.resolve(__dirname, "database", "knex", "migrations"),
    extension: "ts",
  },

  useNullAsDefault: true,
} as Knex.Config