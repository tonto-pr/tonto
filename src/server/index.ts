import createApp from './app';
import * as mongoose from 'mongoose';

import { DB_ADDRESS, DB } from '../config';

mongoose.connect(DB_ADDRESS, {useNewUrlParser: true, useUnifiedTopology: true, dbName: DB})
  .then((m) => console.log('Successfully connected to mongodb'))
  .catch((err) => console.error(err));

const server = createApp();

server.listen(3000);
