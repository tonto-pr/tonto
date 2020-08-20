import * as api from "../../generated/server.generated";
import * as types from "../../generated/common.types.generated";
import * as runtime from "@smartlyio/oats-runtime";
import * as bcrypt from "bcryptjs";
import * as cryptoRandom from "crypto-random-string";
import { knex } from "../../db/database";

export const userEndpoints: api.Endpoints = {
  "/user": {
    post: async (ctx) => {
      const existingUser: types.ShapeOfUser[] = await knex("dim_users")
        .select("*")
        .where({ username: ctx.body.value.username });

      if (existingUser.length > 0) {
        return runtime.json(403, {
          message: "username already exists",
          status: 403,
        });
      }

      if (!ctx.body.value.password) {
        return runtime.json(500, {
          message: "please provide a password",
          status: 500,
        });
      }
      const encrypted_user = { ...ctx.body.value };
      encrypted_user.password = bcrypt.hashSync(ctx.body.value.password, 10);

      encrypted_user.access_token = cryptoRandom({ length: 30 });
      const users: types.ShapeOfUser[] = await knex("dim_users")
        .returning(["user_id", "username", "access_token", "email"])
        .insert(encrypted_user as types.ShapeOfUser);

      if (users.length > 0) {
        return runtime.json(200, users[0]);
      }

      return runtime.json(404, { message: "not found", status: 404 });
    },
  },
  "/user/{user_id}": {
    get: async (ctx) => {
      const user: types.ShapeOfUser[] = await knex("dim_users")
        .select(["user_id", "username", "email"])
        .where({ user_id: ctx.params.user_id });

      if (user) {
        return runtime.json(200, user[0]);
      }

      return runtime.json(404, { message: "not found", status: 404 });
    },
    put: async (ctx) => {
      const user: types.ShapeOfUser[] = await knex("dim_users")
        .where({
          user_id: ctx.params.user_id,
        })
        .returning(["user_id", "username", "email"])
        .update(ctx.body.value);

      if (user) {
        return runtime.json(200, user[0]);
      }

      return runtime.json(404, { message: "not found", status: 404 });
    },
    delete: async (ctx) => {
      const user: types.ShapeOfUser[] = await knex("dim_users")
        .where({ user_id: ctx.params.user_id })
        .returning(["user_id", "username", "email"])
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
