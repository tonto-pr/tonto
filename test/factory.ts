import { knex } from "../db/database";
import * as types from "../generated/common.types.generated";

import * as api from "../generated/client.generated";
import * as axiosAdapter from "@smartlyio/oats-axios-adapter";
import * as runtime from "@smartlyio/oats-runtime";

const apiClient = api.client(axiosAdapter.bind);

const make = async (type: string, props: object = {}) => {
  switch (type) {
    // case 'group':
    //   const temp_group = await PlainGroupModel.create({
    //     members: [],
    //     groupName: 'MJTJP',
    //     ...props
    //   } as types.ShapeOfPlainGroup)
    //   return {...temp_group.toObject(), _id: temp_group.id}  as types.ShapeOfGroup;
    default:
      return { _id: "123" };
  }
};

export const makeUser = async (props: object = {}) => {
  const user = await apiClient.user.post({
    body: runtime.client.json({
      email: "testo@tmc.fi",
      username: "testo",
      password: "abcd",
      ...props,
    }),
  });

  if (user.status === 200) {
    return user.value.value;
  } else {
    throw user.value;
  }
};

export const makeFine = async (props: object = {}) => {
  const fines: types.ShapeOfFine[] = await knex("dim_fines")
    .returning("*")
    .insert({
      amount: 1000,
      description: "sakko.appin kehitys",
      ...props,
    } as types.ShapeOfPlainFine);
  return fines[0];
};

export const makeUserGroup = async (props: {
  users: number[];
  user_group_name?: string;
}) => {
  const userGroup = await apiClient.user_group.post({
    body: runtime.client.json({
      user_group_name: "MJTJP",
      ...props,
    }),
  });

  if (userGroup.status === 200) {
    return userGroup.value.value;
  } else {
    throw userGroup.value;
  }
};

export default make;
