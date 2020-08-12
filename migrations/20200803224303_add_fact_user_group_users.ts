import * as Knex from "knex";

export async function up(knex: Knex): Promise<any> {
  return knex.schema.createTable("fact_user_group_users", (table) => {
    table.increments("user_group_users_id").primary().unique();
    table.integer("user_id").notNullable();
    table.integer("user_group_id").notNullable();
    table.foreign("user_id").references("dim_users.user_id");
    table.foreign("user_group_id").references("dim_user_groups.user_group_id");
  });
}

export async function down(knex: Knex): Promise<any> {
  return knex.schema.dropTable("fact_user_group_users");
}
