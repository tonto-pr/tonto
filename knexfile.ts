import { POSTGRES_URL, POSTGRES_DB } from "./src/config";

module.exports = {
  development: {
    client: "postgresql",
    connection: `${POSTGRES_URL}/${POSTGRES_DB}`
  },
  production: {
    client: "postgresql",
    connection: `${POSTGRES_URL}/${POSTGRES_DB}`
  },
  test: {
    client: "postgresql",
    connection: `${POSTGRES_URL}/${POSTGRES_DB}`
  }
};
