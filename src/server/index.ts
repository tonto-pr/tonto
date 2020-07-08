import createApp from './app';
import * as mongoose from 'mongoose';

import { DB_ADDRESS, DB } from '../config';

console.log("DB_ADDRESS, ", DB_ADDRESS)
console.log("DB, ", DB)
console.log(process.env.NODE_ENV)
mongoose.connect(DB_ADDRESS, {useNewUrlParser: true, useUnifiedTopology: true, dbName: DB})
  .then((m) => console.log('Successfully connected to mongodb'))
  .catch((err) => console.error(err));

mongoose.set('useFindAndModify', false);

const server = createApp();

server.listen(3000);
