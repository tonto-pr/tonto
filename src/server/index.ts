import createApp from './app';
// import * as mongoose from 'mongoose';

// binding all Objection.js models to knex. Enables querying etc.

// import { DB_ADDRESS, DB } from '../config';


// mongoose.connect(DB_ADDRESS, {useNewUrlParser: true, useUnifiedTopology: true, dbName: DB})
//   .then((m) => console.log('Successfully connected to mongodb'))
//   .catch((err) => console.error(err));

// mongoose.set('useFindAndModify', false);

const server = createApp();

server.listen(3000);
