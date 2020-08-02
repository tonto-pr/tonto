import * as Knex from 'knex'

export const knex = Knex(require('../knexfile')[process.env.NODE_ENV as string]);
