import * as api from "../generated/client.generated";
import * as axiosAdapter from "@smartlyio/oats-axios-adapter";

import createApp from "../src/server/app";
import { makeUserGroup, makeUser } from "./factory";

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
      const user = await makeUser();
      await makeUserGroup({ users: [user.user_id] });

      const count = parseInt(
        (await knex("dim_user_groups").count())[0].count as string
      );
      expect(count).toBe(1);
    });
  });

  describe("/user_group/{user_group_id}", () => {
    it("gets a group", async () => {
      const user = await makeUser();
      const userGroup = await makeUserGroup({ users: [user.user_id] });

      const response = await apiClient
        .user_group(userGroup.user_group_id.toString())
        .get();

      expect(response.status).toBe(200);
      expect(response.value.value.user_group_id).toBe(userGroup.user_group_id);
    });

    it("removes a user group", async () => {
      const user = await makeUser();
      const userGroup = await makeUserGroup({ users: [user.user_id] });

      const response = await apiClient
        .user_group(userGroup.user_group_id.toString())
        .delete();

      const count = parseInt(
        (await knex("dim_user_groups").count())[0].count as string
      );

      expect(response.status).toBe(200);
      expect(count).toBe(0);
    });
  });

  describe("/user_group/{user_group_id}/users", () => {
    it("lists all users of a group", async () => {
      const postedUser = await makeUser();
      const postedUser2 = await makeUser({ username: "testo2" });

      const user_group = await makeUserGroup({
        users: [postedUser.user_id, postedUser2.user_id],
      });

      const groupMembers = await apiClient
        .user_group(user_group.user_group_id.toString())
        .users.get();

      expect(groupMembers.value.value.length).toBe(2);
    });
  });

  describe("/{user_id}/user_groups", () => {
    it("lists all user groups", async () => {
      const userOne = await makeUser();
      const userTwo = await makeUser({ username: "testo2" });

      await makeUserGroup({
        user_group_name: "MJTJP2",
        users: [userOne.user_id, userTwo.user_id],
      });
      await makeUserGroup({
        user_group_name: "MJTJP3",
        users: [userOne.user_id],
      });

      const userGroupsOne = await apiClient
        .user(userOne.user_id.toString())
        .user_groups.get();

      const userGroupsTwo = await apiClient
        .user(userTwo.user_id.toString())
        .user_groups.get();

      expect(userGroupsOne.status).toBe(200);
      expect(userGroupsTwo.status).toBe(200);
      expect(userGroupsOne.value.value.length).toBe(2);
      expect(userGroupsTwo.value.value.length).toBe(1);
    });
  });
});
