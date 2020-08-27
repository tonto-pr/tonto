import { POSTGRES_DB } from "../src/config";

const config = require("../knexfile");

const knexClient = require("knex");
const knexInitializer = knexClient(config.fallback);

async function initialiseDatabase() {
  await knexInitializer
    .raw(`CREATE DATABASE ${POSTGRES_DB}`)
    .catch((err: Error) => {
      console.error(
        { err },
        "Something went wrong when initialising database. The database might exist already."
      );
    });

  await knexInitializer.destroy();
}

async function setupDatabase() {
  await initialiseDatabase();
  const knex = knexClient(config[process.env.NODE_ENV as string]);
  await knex.migrate.latest();
  await knex.destroy();
}

setupDatabase();
