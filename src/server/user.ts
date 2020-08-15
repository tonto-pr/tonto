import * as api from "../../generated/server.generated";
import * as types from "../../generated/common.types.generated";
import * as runtime from "@smartlyio/oats-runtime";

import { knex } from "../../db/database";

export const userEndpoints: api.Endpoints = {
  "/user": {
    post: async (ctx) => {
      const user: types.ShapeOfUser[] = await knex("dim_users")
        .returning("*")
        .insert(ctx.body.value as types.ShapeOfUser);

      if (user) {
        return runtime.json(200, user[0]);
      }

      return runtime.json(404, { message: "not found", status: 404 });
    },
  },
  "/user/{user_id}": {
    get: async (ctx) => {
      const user: types.ShapeOfUser[] = await knex("dim_users")
        .select("*")
        .where({ user_id: ctx.params.user_id });

      if (user) {
        return runtime.json(200, user[0]);
      }

      return runtime.json(404, { message: "not found", status: 404 });
    },
    delete: async (ctx) => {
      const user: types.ShapeOfUser[] = await knex("dim_users")
        .where({ user_id: ctx.params.user_id })
        .returning("*")
        .del();

      if (user) {
        return runtime.json(200, user[0]);
      }

      return runtime.json(404, { message: "not found", status: 404 });
    },
  },
  "/user/{user_id}/given_fines": {
    get: async (ctx) => {
      const givenFines: types.ShapeOfGivenFine[] = await knex(
        "fact_given_fines"
      )
        .select("*")
        .where({ giver_user_id: ctx.params.user_id });

      if (givenFines) {
        return runtime.json(200, givenFines);
      }

      return runtime.json(404, { message: "not found", status: 404 });
    },
  },
  "/user/{user_id}/received_fines": {
    get: async (ctx) => {
      const receivedFines: types.ShapeOfGivenFine[] = await knex(
        "fact_given_fines"
      )
        .select("*")
        .where({ receiver_user_id: ctx.params.user_id });

      if (receivedFines) {
        return runtime.json(200, receivedFines);
      }

      return runtime.json(404, { message: "not found", status: 404 });
    },
  },
  "/user/{user_id}/user_groups": {
    get: async (ctx) => {
      const userGroups: types.ShapeOfUserGroup[] = await knex(
        "fact_user_group_users"
      )
        .select("dim_user_groups.*")
        .leftJoin(
          "dim_user_groups",
          "fact_user_group_users.user_group_id",
          "dim_user_groups.user_group_id"
        )
        .where({ user_id: ctx.params.user_id });

      if (userGroups) {
        return runtime.json(200, userGroups);
      }
      return runtime.json(404, { message: "not found", status: 404 });
    },
  },
};
