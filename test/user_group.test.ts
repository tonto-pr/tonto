import * as api from "../generated/client.generated";
import * as axiosAdapter from "@smartlyio/oats-axios-adapter";

import createApp from "../src/server/app";
import { makeUserGroup } from "./factory";

import { knex } from "../db/database";

describe("UserGroup", () => {
  const app = createApp();
  const server = app.listen(3000);
  const apiClient = api.client(axiosAdapter.bind);

  afterEach(async () => {
    await knex("fact_user_group_users").del();
    await knex("dim_users").del();
    await knex("dim_user_groups").del();
  });
  afterAll(async () => {
    await knex.destroy();
    server.close();
  });

  describe("/user_group", () => {
    it("creates a user group", async () => {
      await makeUserGroup();

      const count = parseInt(
        (await knex("dim_user_groups").count())[0].count as string
      );
      expect(count).toBe(1);
    });
  });

  describe("/user_group/{user_group_id}", () => {
    it("gets a group", async () => {
      const userGroup = await makeUserGroup();

      if (userGroup.user_group_id) {
        const response = await apiClient
          .user_group(userGroup.user_group_id.toString())
          .get();

        expect(response.status).toBe(200);
        expect(response.value.value.user_group_id).toBe(
          userGroup.user_group_id
        );
      } else {
        fail();
      }
    });

    it("removes a user group", async () => {
      const userGroup = await makeUserGroup();

      if (userGroup.user_group_id) {
        const response = await apiClient
          .user_group(userGroup.user_group_id.toString())
          .delete();

        const count = parseInt(
          (await knex("dim_user_groups").count())[0].count as string
        );

        expect(response.status).toBe(200);
        expect(count).toBe(0);
      } else {
        fail();
      }
    });
  });
});
