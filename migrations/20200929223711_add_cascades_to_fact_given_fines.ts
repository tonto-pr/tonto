import * as Knex from "knex";

export async function up(knex: Knex): Promise<any> {
  const dropForeignsFactUserGroupFines = knex.schema.table(
    "fact_user_group_fines",
    (table) => {
      table.dropForeign(["fine_id"]);
      table.dropForeign(["user_group_id"]);
    }
  );

  const alterFactUserGroupFines = knex.schema.alterTable(
    "fact_user_group_fines",
    (table) => {
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

  return dropForeignsFactUserGroupFines.then(() => alterFactUserGroupFines);
}

export async function down(knex: Knex): Promise<any> {
  const dropForeignsFactUserGroupFines = knex.schema.table(
    "fact_user_group_fines",
    (table) => {
      table.dropForeign(["fine_id"]);
      table.dropForeign(["user_group_id"]);
    }
  );

  const alterFactUserGroupFines = knex.schema.alterTable(
    "fact_user_group_fines",
    (table) => {
      table.foreign("fine_id").references("dim_fines.fine_id");
      table
        .foreign("user_group_id")
        .references("dim_user_groups.user_group_id");
    }
  );

  return dropForeignsFactUserGroupFines.then(() => alterFactUserGroupFines);
}
