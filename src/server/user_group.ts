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
  "/user_group/search": {
    get: async (ctx) => {
      let userGroups: types.ShapeOfUserGroup[];
      if (ctx.query.user_id) {
        userGroups = await knex("fact_user_group_users")
          .select("dim_user_groups.*")
          .leftJoin(
            "dim_user_groups",
            "fact_user_group_users.user_group_id",
            "dim_user_groups.user_group_id"
          )
          .where("user_group_name", "ilike", `%${ctx.query.query}%`)
          .andWhere({
            user_id: ctx.query.user_id,
          });
      } else {
        userGroups = await knex("dim_user_groups")
          .select("*")
          .where("user_group_name", "ilike", `%${ctx.query.query}%`);
      }

      if (userGroups.length > 0) {
        return runtime.json(200, userGroups);
      }
      return runtime.json(404, { message: "not found", status: 404 });
    },
  },
  "/user_group/users/add": {
    post: async (ctx) => {
      const userGroupUsers: types.ShapeOfUserGroupUsers[] = (
        await Promise.all(
          ctx.body.value.map((userGroupUser) => {
            return knex("fact_user_group_users")
              .returning("*")
              .insert(userGroupUser) as Promise<types.ShapeOfUserGroupUsers>;
          })
        )
      ).flat();

      const userGroupUsersWithProps: types.ShapeOfUserGroupUsersWithProps[] = (
        await Promise.all(
          userGroupUsers
            .map(async (userGroupUser) => {
              const { rows } = await knex.raw(`
                SELECT row_to_json(dim_users) as user, row_to_json(dim_user_groups) as user_group, user_group_users_id
                FROM fact_user_group_users
                LEFT JOIN (SELECT user_id, username, email FROM dim_users) dim_users
                ON dim_users.user_id = fact_user_group_users.user_id
                LEFT JOIN dim_user_groups
                ON dim_user_groups.user_group_id = fact_user_group_users.user_group_id
                WHERE user_group_users_id = ${userGroupUser.user_group_users_id};
              `);
              return rows as types.ShapeOfUserGroupUsersWithProps;
            })
            .flat()
        )
      ).flat();

      if (userGroupUsersWithProps.length > 0) {
        return runtime.json(200, userGroupUsersWithProps);
      }

      return runtime.json(404, { message: "not found", status: 404 });
    },
  },
  "/user_group/users/delete": {
    post: async (ctx) => {
      const userGroupUsersWithProps: types.ShapeOfUserGroupUsersWithProps[] = (
        await Promise.all(
          ctx.body.value
            .map(async (userGroupUser) => {
              const { rows } = await knex.raw(`
                SELECT row_to_json(dim_users) as user, row_to_json(dim_user_groups) as user_group, user_group_users_id
                FROM fact_user_group_users
                LEFT JOIN (SELECT user_id, username, email FROM dim_users) dim_users
                ON dim_users.user_id = fact_user_group_users.user_id
                LEFT JOIN dim_user_groups
                ON dim_user_groups.user_group_id = fact_user_group_users.user_group_id
                WHERE fact_user_group_users.user_group_id = ${userGroupUser.user_group_id}
                AND fact_user_group_users.user_id = ${userGroupUser.user_id};
              `);
              return rows as types.ShapeOfUserGroupUsersWithProps;
            })
            .flat()
        )
      ).flat();

      const userGroupUsers: types.ShapeOfUserGroupUsers[] = (
        await Promise.all(
          ctx.body.value.map((userGroupUser) => {
            return knex("fact_user_group_users")
              .returning("*")
              .where({
                user_group_id: userGroupUser.user_group_id,
                user_id: userGroupUser.user_id,
              })
              .del() as Promise<types.ShapeOfUserGroupUsers>;
          })
        )
      ).flat();

      if (userGroupUsers.length > 0) {
        return runtime.json(200, userGroupUsersWithProps);
      }

      return runtime.json(404, { message: "not found", status: 404 });
    },
  },
  "/user_group/fines/add": {
    post: async (ctx) => {
      const userGroupFines: types.ShapeOfUserGroupFines[] = (
        await Promise.all(
          ctx.body.value.map((userGroupFine) => {
            return knex("fact_user_group_fines")
              .returning("*")
              .insert(userGroupFine) as Promise<types.ShapeOfUserGroupFines>;
          })
        )
      ).flat();

      const userGroupFinesWithProps: types.ShapeOfUserGroupFinesWithProps[] = (
        await Promise.all(
          userGroupFines
            .map(async (userGroupFine) => {
              const { rows } = await knex.raw(`
                SELECT row_to_json(dim_fines) as fine, row_to_json(dim_user_groups) as user_group, user_group_fines_id
                FROM fact_user_group_fines
                LEFT JOIN dim_fines
                ON dim_fines.fine_id = fact_user_group_fines.fine_id
                LEFT JOIN dim_user_groups
                ON dim_user_groups.user_group_id = fact_user_group_fines.user_group_id
                WHERE user_group_fines_id = ${userGroupFine.user_group_fines_id};
              `);
              return rows as types.ShapeOfUserGroupFinesWithProps;
            })
            .flat()
        )
      ).flat();

      if (userGroupFinesWithProps.length > 0) {
        return runtime.json(200, userGroupFinesWithProps);
      }

      return runtime.json(404, { message: "not found", status: 404 });
    },
  },
  "/user_group/fines/delete": {
    post: async (ctx) => {
      const userGroupFinesWithProps: types.ShapeOfUserGroupFinesWithProps[] = (
        await Promise.all(
          ctx.body.value
            .map(async (userGroupFine) => {
              const { rows } = await knex.raw(`
                SELECT row_to_json(dim_fines) as fine, row_to_json(dim_user_groups) as user_group, user_group_fines_id
                FROM fact_user_group_fines
                LEFT JOIN dim_fines
                ON dim_fines.fine_id = fact_user_group_fines.fine_id
                LEFT JOIN dim_user_groups
                ON dim_user_groups.user_group_id = fact_user_group_fines.user_group_id
                WHERE fact_user_group_fines.user_group_id = ${userGroupFine.user_group_id}
                AND fact_user_group_fines.fine_id = ${userGroupFine.fine_id};
              `);
              return rows as types.ShapeOfUserGroupFinesWithProps;
            })
            .flat()
        )
      ).flat();

      const userGroupFines: types.ShapeOfUserGroupFines[] = (
        await Promise.all(
          ctx.body.value.map((userGroupFine) => {
            return knex("fact_user_group_fines")
              .returning("*")
              .where({
                user_group_id: userGroupFine.user_group_id,
                fine_id: userGroupFine.fine_id,
              })
              .del() as Promise<types.ShapeOfUserGroupFines>;
          })
        )
      ).flat();

      if (userGroupFines.length > 0) {
        return runtime.json(200, userGroupFinesWithProps);
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
        .select(["dim_users.user_id", "dim_users.username", "dim_users.email"])
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
};
