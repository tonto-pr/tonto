import * as api from "../../generated/server.generated";
import * as types from "../../generated/common.types.generated";
import * as runtime from "@smartlyio/oats-runtime";
import * as bcrypt from "bcryptjs";
import * as cryptoRandom from "crypto-random-string";

import { knex } from "../../db/database";

export const aclEndpoints: api.Endpoints = {
  "/login": {
    post: async (ctx) => {
      if (ctx.body.value.access_token) {
        const users: types.ShapeOfUser[] = await knex("dim_users")
          .select(["user_id", "username", "email"])
          .where({ access_token: ctx.body.value.access_token });
        if (users.length === 1) {
          return runtime.json(200, users[0]);
        }
      }

      const users: types.ShapeOfUser[] = await knex("dim_users")
        .where({ username: ctx.body.value.username })
        .returning(["user_id", "username", "email", "password", "access_token"])
        .update({ access_token: cryptoRandom({ length: 30 }) });
      if (users.length === 1) {
        const { password, ...user } = users[0];
        if (!ctx.body.value.password) {
          return runtime.json(500, {
            message: "please provide a password",
            status: 500,
          });
        }
        if (
          password &&
          !bcrypt.compareSync(ctx.body.value.password, password)
        ) {
          return runtime.json(401, { message: "unauthorized", status: 401 });
        } else {
          return runtime.json(200, user);
        }
      } else if (users.length > 1) {
        console.log("Duplicate users found");
      }
      return runtime.json(404, { message: "not found", status: 404 });
    },
  },
  "/beta/activate": {
    post: async (ctx) => {
      const keys: types.ShapeOfBetaKey[] = await knex("dim_beta_keys")
        .select("*")
        .where({ beta_key: ctx.body.value.beta_key, activated: false });

      if (keys.length === 0) {
        return runtime.json(404, {
          message: "key already activated",
          status: 404,
        });
      }

      const updatedKeys: types.ShapeOfBetaKey[] = await knex("dim_beta_keys")
        .where({ beta_key: ctx.body.value.beta_key })
        .returning("*")
        .update({ activated: true });

      if (updatedKeys.length > 0) {
        return runtime.json(200, updatedKeys[0]);
      }

      return runtime.json(404, { message: "not found", status: 404 });
    },
  },
};
