import * as Knex from "knex";

export async function up(knex: Knex): Promise<any> {
  return knex.schema.createTable('dim_users', table => {
    table.increments('user_id').primary().unique()
    table.string('email').notNullable()
    table.string('username').notNullable()
    table.string('password').notNullable()
  })
}

export async function down(knex: Knex): Promise<any> {
  return knex.schema.dropTable('dim_users')
}
