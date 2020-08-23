import * as api from "../../generated/server.generated";
import * as types from "../../generated/common.types.generated";
import * as runtime from "@smartlyio/oats-runtime";

import { knex } from "../../db/database";

export const userGroupEndpoints: api.Endpoints = {
  "/user_group": {
    post: async (ctx) => {
      const userGroup: types.ShapeOfUserGroup[] = await knex("dim_user_groups")
        .returning("*")
        .insert(ctx.body.value as types.ShapeOfUserGroup);

      if (userGroup) {
        return runtime.json(200, userGroup[0]);
      }

      return runtime.json(404, { message: "not found", status: 404 });
    },
  },
  "/user_group/{user_group_id}": {
    get: async (ctx) => {
      const userGroup: types.ShapeOfUserGroup[] = await knex("dim_user_groups")
        .select("*")
        .where({ user_group_id: ctx.params.user_group_id });

      if (userGroup) {
        return runtime.json(200, userGroup[0]);
      }

      return runtime.json(404, { message: "not found", status: 404 });
    },
    delete: async (ctx) => {
      const userGroup: types.ShapeOfUserGroup[] = await knex("dim_user_groups")
        .where({ user_group_id: ctx.params.user_group_id })
        .returning("*")
        .del();

      if (userGroup) {
        return runtime.json(200, userGroup[0]);
      }

      return runtime.json(404, { message: "not found", status: 404 });
    },
  },
  "/user_group/{user_group_id}/users": {
    get: async (ctx) => {
      const users: types.ShapeOfUser[] = await knex("fact_user_group_users")
        .select("dim_users.*")
        .leftJoin(
          "dim_users",
          "fact_user_group_users.user_id",
          "dim_users.user_id"
        )
        .where({ user_group_id: ctx.params.user_group_id });

      if (users) {
        return runtime.json(200, users);
      }
      return runtime.json(404, { message: "not found", status: 404 });
    },
  },
  "/user_group/users/add": {
    post: async (ctx) => {
      const userGroupUsers = await Promise.all(
        ctx.body.value.map((userGroupUsers) => {
          return knex("fact_user_group_users")
            .returning("*")
            .insert(userGroupUsers as types.ShapeOfUserGroupUsers);
        })
      );

      if (userGroupUsers.length > 0) {
        return runtime.json(200, ctx.body.value);
      }

      return runtime.json(404, { message: "not found", status: 404 });
    },
  },
};
