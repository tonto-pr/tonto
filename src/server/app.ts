import * as api from "../../generated/server.generated";
import * as types from "../../generated/common.types.generated";
import * as runtime from "@smartlyio/oats-runtime";
import * as koaAdapter from "@smartlyio/oats-koa-adapter";
import * as Koa from "koa";
import * as koaBody from "koa-body";
import * as bcrypt from "bcryptjs";
import * as cors from "@koa/cors";
import * as cryptoRandom from "crypto-random-string";

import { knex } from "../../db/database";

const spec: api.Endpoints = {
  "/fine": {
    post: async (ctx) => {
      const fine: types.ShapeOfFine[] = await knex("dim_fines")
        .returning("*")
        .insert(ctx.body.value as types.ShapeOfFine);

      if (fine) {
        return runtime.json(200, fine[0]);
      }

      return runtime.json(404, { message: "not found", status: 404 });
    },
  },
  "/fine/give": {
    post: async (ctx) => {
      const givenFine: types.ShapeOfGivenFine[] = await knex("fact_given_fines")
        .returning("*")
        .insert(ctx.body.value as types.ShapeOfGivenFine);

      if (givenFine) {
        return runtime.json(200, givenFine[0]);
      }

      return runtime.json(404, { message: "not found", status: 404 });
    },
  },
  "/fine/{fine_id}": {
    get: async (ctx) => {
      const fine: types.ShapeOfFine[] = await knex("dim_fines")
        .select("*")
        .where({ fine_id: ctx.params.fine_id });

      if (fine) {
        return runtime.json(200, fine[0]);
      }

      return runtime.json(404, { message: "not found", status: 404 });
    },
    put: async (ctx) => {
      const fine: types.ShapeOfFine[] = await knex("dim_fines")
        .where({
          fine_id: ctx.params.fine_id,
        })
        .returning("*")
        .update(ctx.body.value);

      if (fine) {
        return runtime.json(200, fine[0]);
      }

      return runtime.json(404, { message: "not found", status: 404 });
    },
    delete: async (ctx) => {
      const fine: types.ShapeOfFine[] = await knex("dim_fines")
        .where({ fine_id: ctx.params.fine_id })
        .returning("*")
        .del();

      if (fine) {
        return runtime.json(200, fine[0]);
      }

      return runtime.json(404, { message: "not found", status: 404 });
    },
  },
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
        .returning(["user_id", "username", "email", "password"])
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
};

const routes = koaAdapter.bind(api.router, spec);

const createApp = (): Koa => {
  const app = new Koa();

  const corsOptions = {
    origin: "*",
  };

  app.use(cors(corsOptions));
  app.use(koaBody({ multipart: true }));
  app.use(routes.routes());
  console.log("Starting server");

  return app;
};

export default createApp;
