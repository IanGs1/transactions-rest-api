import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable("transactions", (table) => {
    table.decimal("amount", 10, 2).notNullable();
    table.uuid("session_id").after("id").index();

    table.timestamp("created_at").defaultTo(knex.fn.now());
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable("transactions", (table) => {
    table.dropColumn("amount");
    table.dropColumn("session_id");

    table.dropColumn("created_at");
  })
}

