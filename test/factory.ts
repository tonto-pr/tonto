import { knex } from '../db/database';
import * as types from '../generated/common.types.generated';

const make = async (type: string, props: object = {}) => {
  switch(type) {
    // case 'group':
    //   const temp_group = await PlainGroupModel.create({
    //     members: [],
    //     groupName: 'MJTJP',
    //     ...props
    //   } as types.ShapeOfPlainGroup)
    //   return {...temp_group.toObject(), _id: temp_group.id}  as types.ShapeOfGroup;
    default:
      return {_id: "123"}
  }
}

export const makeUser = async (props: object = {}) => {
  const users: types.ShapeOfUser[] = await knex('dim_users').returning('*').insert({
    email: 'testo@tmc.fi',
    username: 'testo',
    password: 'abcd',
    ...props
  } as types.ShapeOfPlainUser)
  return users[0]
}

export const makeFine = async (props: object = {}) => {
  const fines: types.ShapeOfFine[] = await knex('dim_fines').returning('*').insert({
    amount: 1000,
    description: 'sakko.appin kehitys',
    ...props
  } as types.ShapeOfPlainFine)
  return fines[0]
}

export default make;