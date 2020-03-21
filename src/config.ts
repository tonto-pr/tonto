import * as dotenv from 'dotenv';

dotenv.config();

let path;
switch (process.env.NODE_ENV) {
  case "production":
    path = `${__dirname}/../awsfile.dev.yaml`;
    break;
  default:
    path = `${__dirname}/../awsfile.dev.yaml`;
}

dotenv.config({ path: path });

function fromEnv(variable: string) {
    const processVariable = process.env[variable];
    if (processVariable) return processVariable;

    return "";
}

export const DB_ADDRESS: string = fromEnv('DB_ADDRESS');
