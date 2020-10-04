import * as Knex from "knex";

export async function up(knex: Knex): Promise<any> {
  return knex.schema.createTable("dim_beta_keys", (table) => {
    table.increments("beta_key_id").primary().unique();
    table.string("beta_key").notNullable();
    table.boolean("activated").defaultTo(false);
  });
}

export async function down(knex: Knex): Promise<any> {
  return knex.schema.dropTable("dim_beta_keys");
}
