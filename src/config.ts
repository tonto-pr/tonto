import * as dotenv from 'dotenv';

let path;
switch (process.env.NODE_ENV) {
  case "production":
    path = `${__dirname}/../.env`;
    break;
  case "development":
    path = `${__dirname}/../.env.development`;
    break;
  case "test":
    path = `${__dirname}/../.env.test`;
    break;
  default:
    path = `${__dirname}/../.env`;
}

dotenv.config({ path: path });

function fromEnv(variable: string) {
    const processVariable = process.env[variable];
    if (processVariable) return processVariable;

    return "";
}

export const DB_ADDRESS: string = fromEnv('DB_ADDRESS');
export const DB: string = fromEnv('DB');