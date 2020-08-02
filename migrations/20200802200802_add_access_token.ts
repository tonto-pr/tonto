import * as Knex from "knex";


export async function up(knex: Knex): Promise<any> {
  return knex.schema.table('dim_users', table => {
    table.string('access_token')
  })
}


export async function down(knex: Knex): Promise<any> {
  return knex.schema.table('dim_users', table => {
    table.dropColumn('access_token')
  })
}

