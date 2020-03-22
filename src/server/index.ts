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

const EntityModel = getModelForClass(types.Entity);
const EntityShellModel = getModelForClass(types.EntityShell);
const ErrorModel = getModelForClass(types.Error);

const values: { [key: string]: types.Entity } = {};

const spec: api.Endpoints = {
  '/entity': {
    post: async ctx => {
      values[ctx.body.value.id] = types.Entity.make({
        id: ctx.body.value.id,
        name: ctx.body.value.name
      }).success();
      return runtime.json(200, values[ctx.body.value.id]);
    }
  },
  '/entity/{entityId}': {
    delete: async ctx => {
      const entity = values[ctx.params.entityId]

      if (entity) {
        const temp_name = entity.name;
        delete values[ctx.params.entityId];
        return runtime.json(200, {id: ctx.params.entityId, name: temp_name});
      }
      return runtime.json(404, { message: 'not found', status: 404 });
    },
    get: async ctx => {
      const entity = values[ctx.params.entityId];
      if (entity) {
        return runtime.json(200, entity);
      }
      return runtime.json(404, { message: 'not found', status: 404 });
    },
    put: async ctx => {
      const entity = values[ctx.params.entityId];
      if (entity) {
        return runtime.json(200, entity);
      }
      return runtime.json(404, { message: 'not found', status: 404 });
    }
  },
  '/entities': {
    get: async ctx => {
      const entities = await EntityModel.find({});
      if (entities) {
        return runtime.json(200, entities);
      }
      return runtime.json(404, { message: 'not found', status: 404 });
    }
  },
  '/test': {
    get: async ctx => {
      const { _id: id } = await EntityModel.create({id: '12', name: 'hello'} as types.ShapeOfEntity); // an "as" assertion, to have types for all properties
      const entity = await EntityModel.findById(id).exec();

      const { _id: status } = await ErrorModel.create({status: 400, message: 'hello'} as types.ShapeOfError); // an "as" assertion, to have types for all properties
      const error = await ErrorModel.findById(status).exec();
      console.log(error)

      const { _id: shellId } = await EntityShellModel.create({shellId: '3300', childEntity: {id: '11', name: 'child'}} as types.ShapeOfEntityShell); // an "as" assertion, to have types for all properties
      const entityShell = await EntityShellModel.findById(shellId).exec();
      console.log(entityShell)
      
      return runtime.text(200, `${entity?.id} + ${entity?.name}`);
    }
  }
};

const routes = koaAdapter.bind(api.router, spec);

const app = new Koa();

app.use(koaBody({ multipart: true }));
app.use(routes.routes());
console.log("Starting server");

app.listen(3000);
