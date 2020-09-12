import * as Knex from "knex";

export async function up(knex: Knex): Promise<any> {
  return knex.schema.table("fact_given_fines", (table) => {
    table.timestamp("created_at").defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<any> {
  return knex.schema.table("fact_given_fines", (table) => {
    table.dropColumn("created_at");
  });
}
