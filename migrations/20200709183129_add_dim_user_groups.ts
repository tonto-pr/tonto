import * as Knex from "knex";

export async function up(knex: Knex): Promise<any> {
  return knex.schema.createTable('dim_user_groups', table => {
    table.increments('user_group_id').primary().unique()
    table.string('user_group_name').notNullable()
  })
}

export async function down(knex: Knex): Promise<any> {
  return knex.schema.dropTable('dim_user_groups')
}
