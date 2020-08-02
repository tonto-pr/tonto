const variables = require('../secrets/decrypted/variables.json')

interface Config {
  [key: string]: string
}

const config: Config = variables[process.env.NODE_ENV || 'development']

function fromEnv(variable: string) {
  const processVariable = config[variable];
  if (processVariable) return processVariable;

  return "";
}

export const DB: string = fromEnv('DB');
export const DB_ADDRESS: string = fromEnv('DB_ADDRESS');
export const POSTGRES_URL: string = fromEnv('POSTGRES_URL');
export const POSTGRES_DB: string = fromEnv('POSTGRES_DB');
