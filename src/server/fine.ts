import * as api from "../../generated/server.generated";
import * as types from "../../generated/common.types.generated";
import * as runtime from "@smartlyio/oats-runtime";

import { knex } from "../../db/database";

export const fineEndpoints: api.Endpoints = {
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
  "/fine/search": {
    get: async (ctx) => {
      let fines: types.ShapeOfFineWithUserGroup[];

      if (ctx.query.user_group_id) {
        fines = (
          await knex.raw(`
          SELECT dim_fines.*, row_to_json(dim_user_groups) as user_group
          FROM fact_user_group_fines
          LEFT JOIN dim_fines
          ON dim_fines.fine_id = fact_user_group_fines.fine_id
          LEFT JOIN dim_user_groups
          ON dim_user_groups.user_group_id = fact_user_group_fines.user_group_id
          WHERE description ILIKE '%${ctx.query.query}%'
          AND fact_user_group_fines.user_group_id = ${ctx.query.user_group_id}
        `)
        ).rows;
      } else if (ctx.query.user_id) {
        fines = (
          await knex.raw(`
          SELECT dim_fines.*, row_to_json(dim_user_groups) as user_group
          FROM fact_user_group_users
          LEFT JOIN fact_user_group_fines
          ON fact_user_group_fines.user_group_id = fact_user_group_users.user_group_id
          LEFT JOIN dim_fines
          ON dim_fines.fine_id = fact_user_group_fines.fine_id
          LEFT JOIN dim_user_groups
          ON dim_user_groups.user_group_id = fact_user_group_fines.user_group_id
          WHERE description ILIKE '%${ctx.query.query}%'
          AND fact_user_group_users.user_id = ${ctx.query.user_id}
          `)
        ).rows;
      } else {
        return runtime.json(500, {
          message:
            "you must provide either user_group_id or user_id as a query parameter",
          status: 500,
        });
      }

      if (fines.length > 0) {
        return runtime.json(200, fines);
      }
      return runtime.json(404, { message: "not found", status: 404 });
    },
  },
  "/fine/give": {
    post: async (ctx) => {
      const givenFines: types.ShapeOfGivenFine[] = await knex(
        "fact_given_fines"
      )
        .returning("*")
        .insert(ctx.body.value as types.ShapeOfGivenFine);

      const givenFinesWithProps: types.ShapeOfGivenFineWithProps[] = (
        await knex.raw(`
        SELECT
          row_to_json(dim_users_receiver) as receiver_user,
          row_to_json(dim_users_giver) as giver_user,
          row_to_json(dim_user_groups) as user_group,
          row_to_json(dim_fines) as fine,
          given_fine_id,
          extract(epoch from created_at at time zone 'utc')::integer created_at
        FROM fact_given_fines
        LEFT JOIN (SELECT user_id, username, email FROM dim_users) dim_users_receiver
        ON dim_users_receiver.user_id = fact_given_fines.receiver_user_id
        LEFT JOIN (SELECT user_id, username, email FROM dim_users) dim_users_giver
        ON dim_users_giver.user_id = fact_given_fines.giver_user_id
        LEFT JOIN dim_user_groups
        ON dim_user_groups.user_group_id = fact_given_fines.user_group_id
        LEFT JOIN dim_fines
        ON dim_fines.fine_id = fact_given_fines.fine_id
        WHERE given_fine_id = ${givenFines[0].given_fine_id}
      `)
      ).rows;

      if (givenFinesWithProps.length > 0) {
        return runtime.json(200, givenFinesWithProps[0]);
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
};
