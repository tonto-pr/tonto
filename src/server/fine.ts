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
