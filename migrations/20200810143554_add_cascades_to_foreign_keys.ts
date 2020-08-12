import * as Knex from "knex";

export async function up(knex: Knex): Promise<any> {
  const dropForeignsFactUserGroupUsers = knex.schema.table(
    "fact_user_group_users",
    (table) => {
      table.dropForeign(["user_id"]);
      table.dropForeign(["user_group_id"]);
    }
  );

  const alterFactUserGroupUsers = knex.schema.alterTable(
    "fact_user_group_users",
    (table) => {
      table
        .foreign("user_id")
        .references("dim_users.user_id")
        .onDelete("CASCADE")
        .onUpdate("CASCADE");
      table
        .foreign("user_group_id")
        .references("dim_user_groups.user_group_id")
        .onDelete("CASCADE")
        .onUpdate("CASCADE");
    }
  );

  const dropForeignsFactGivenNames = knex.schema.table(
    "fact_given_fines",
    (table) => {
      table.dropForeign(["giver_user_id"]);
      table.dropForeign(["receiver_user_id"]);
      table.dropForeign(["fine_id"]);
      table.dropForeign(["user_group_id"]);
    }
  );

  const alterFactGivenFines = knex.schema.alterTable(
    "fact_given_fines",
    (table) => {
      table
        .foreign("giver_user_id")
        .references("dim_users.user_id")
        .onDelete("CASCADE")
        .onUpdate("CASCADE");
      table
        .foreign("receiver_user_id")
        .references("dim_users.user_id")
        .onDelete("CASCADE")
        .onUpdate("CASCADE");
      table
        .foreign("fine_id")
        .references("dim_fines.fine_id")
        .onDelete("CASCADE")
        .onUpdate("CASCADE");
      table
        .foreign("user_group_id")
        .references("dim_user_groups.user_group_id")
        .onDelete("CASCADE")
        .onUpdate("CASCADE");
    }
  );

  return dropForeignsFactUserGroupUsers
    .then(() => alterFactUserGroupUsers)
    .then(() => dropForeignsFactGivenNames)
    .then(() => alterFactGivenFines);
}

export async function down(knex: Knex): Promise<any> {
  const dropForeignsFactUserGroupUsers = knex.schema.table(
    "fact_user_group_users",
    (table) => {
      table.dropForeign(["user_id"]);
      table.dropForeign(["user_group_id"]);
    }
  );

  const alterFactUserGroupUsers = knex.schema.alterTable(
    "fact_user_group_users",
    (table) => {
      table.foreign("user_id").references("dim_users.user_id");
      table
        .foreign("user_group_id")
        .references("dim_user_groups.user_group_id");
    }
  );

  const dropForeignsFactGivenNames = knex.schema.table(
    "fact_given_fines",
    (table) => {
      table.dropForeign(["giver_user_id"]);
      table.dropForeign(["receiver_user_id"]);
      table.dropForeign(["fine_id"]);
      table.dropForeign(["user_group_id"]);
    }
  );

  const alterFactGivenFines = knex.schema.alterTable(
    "fact_given_fines",
    (table) => {
      table.foreign("giver_user_id").references("dim_users.user_id");
      table.foreign("receiver_user_id").references("dim_users.user_id");
      table.foreign("fine_id").references("dim_fines.fine_id");
      table
        .foreign("user_group_id")
        .references("dim_user_groups.user_group_id");
    }
  );

  return dropForeignsFactUserGroupUsers
    .then(() => alterFactUserGroupUsers)
    .then(() => dropForeignsFactGivenNames)
    .then(() => alterFactGivenFines);
}
