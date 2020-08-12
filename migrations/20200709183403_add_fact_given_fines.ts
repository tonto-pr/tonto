import * as Knex from "knex";

export async function up(knex: Knex): Promise<any> {
  return knex.schema.createTable("fact_given_fines", (table) => {
    table.increments("given_fine_id").primary().unique();
    table.integer("giver_user_id").notNullable();
    table.integer("receiver_user_id").notNullable();
    table.integer("fine_id").notNullable();
    table.integer("user_group_id");
    table.foreign("giver_user_id").references("dim_users.user_id");
    table.foreign("receiver_user_id").references("dim_users.user_id");
    table.foreign("fine_id").references("dim_fines.fine_id");
    table.foreign("user_group_id").references("dim_user_groups.user_group_id");
  });
}

export async function down(knex: Knex): Promise<any> {
  return knex.schema.dropTable("fact_given_fines");
}
