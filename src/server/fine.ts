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
};
