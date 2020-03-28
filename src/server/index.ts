import * as api from '../../generated/server.generated';
import * as types from '../../generated/common.types.generated';
import * as runtime from '@smartlyio/oats-runtime';
import * as koaAdapter from '@smartlyio/oats-koa-adapter';
import * as Koa from 'koa';
import * as koaBody from 'koa-body';
import * as mongoose from 'mongoose';
import { DB_ADDRESS } from '../config';

import { getModelForClass } from '@typegoose/typegoose';
import injectTypegooseDecorators from './injector';

mongoose.connect(DB_ADDRESS, {useNewUrlParser: true, useUnifiedTopology: true, dbName: 'tonto'})
  .then((m) => console.log('Successfully connected to mongodb'))
  .catch((err) => console.error(err));

injectTypegooseDecorators();

const FineModel = getModelForClass(types.Fine);
const ErrorModel = getModelForClass(types.Error);

const values: { [key: string]: types.Fine } = {};

const spec: api.Endpoints = {
  '/fine': {
    post: async ctx => {
      values[ctx.body.value.id] = types.Fine.make({
        id: ctx.body.value.id,
        name: ctx.body.value.name
      }).success();
      return runtime.json(200, values[ctx.body.value.id]);
    }
  },
  '/fine/{fineId}': {
    delete: async ctx => {
      const fine = values[ctx.params.fineId]

      if (fine) {
        const temp_name = fine.name;
        delete values[ctx.params.fineId];
        return runtime.json(200, {id: ctx.params.fineId, name: temp_name});
      }
      return runtime.json(404, { message: 'not found', status: 404 });
    },
    get: async ctx => {
      const fine = values[ctx.params.fineId];
      if (fine) {
        return runtime.json(200, fine);
      }
      return runtime.json(404, { message: 'not found', status: 404 });
    },
    put: async ctx => {
      const fine = values[ctx.params.fineId];
      if (fine) {
        return runtime.json(200, fine);
      }
      return runtime.json(404, { message: 'not found', status: 404 });
    }
  },
  '/fines': {
    get: async ctx => {
      const fines = await FineModel.find({});
      if (fines) {
        return runtime.json(200, fines);
      }
      return runtime.json(404, { message: 'not found', status: 404 });
    }
  },
  '/test': {
    get: async ctx => {
      const { _id: id } = await FineModel.create({id: '12', name: 'hello'} as types.ShapeOfFine); // an "as" assertion, to have types for all properties
      const fine = await FineModel.findById(id).exec();

      const { _id: status } = await ErrorModel.create({status: 400, message: 'hello'} as types.ShapeOfError); // an "as" assertion, to have types for all properties
      const error = await ErrorModel.findById(status).exec();
      console.log(error)
      
      return runtime.text(200, `${fine?.id} + ${fine?.name}`);
    }
  }
};

const routes = koaAdapter.bind(api.router, spec);

const app = new Koa();

app.use(koaBody({ multipart: true }));
app.use(routes.routes());
console.log("Starting server");

app.listen(3000);
