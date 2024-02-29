import { knex as defaultKnex } from "knex";

import knexConfig from "../../../knexfile";

export const knex = defaultKnex(knexConfig);