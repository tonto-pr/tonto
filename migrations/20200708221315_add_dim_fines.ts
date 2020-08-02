import * as Knex from "knex";

export async function up(knex: Knex): Promise<any> {
  return knex.schema.createTable('dim_fines', table => {
    table.increments('fine_id').primary().unique()
    table.integer('amount').notNullable()
    table.string('description').notNullable()
  })
}

export async function down(knex: Knex): Promise<any> {
  return knex.schema.dropTable('dim_fines')
}
