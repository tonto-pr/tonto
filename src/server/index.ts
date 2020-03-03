import * as api from '../../generated/server.generated';
import * as types from '../../generated/common.types.generated';
import * as runtime from '@smartlyio/oats-runtime';
import * as koaAdapter from '@smartlyio/oats-koa-adapter';
import * as Koa from 'koa';
import * as koaBody from 'koa-body';
import * as mongoose from 'mongoose';
import { getModelForClass } from '@typegoose/typegoose';
import injectTypegooseDecorators from './injector';

mongoose.connect('mongodb://mongo:27017/tonto', {useNewUrlParser: true, useUnifiedTopology: true, dbName: 'tonto'})
  .then((m) => console.log('Successfully connected to mongodb'))
  .catch((err) => console.error(err));

injectTypegooseDecorators();

const EntityModel = getModelForClass(types.Entity);
const EntityShellModel = getModelForClass(types.EntityShell);
const ErrorModel = getModelForClass(types.Error);

// setup a db :)
const values: { [key: string]: types.Entity } = {};

// 'api.Endpoints' is the generated type of the server
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

// 'koaAdapter.bind'  binds the endpoint implemantion in'spec' to koa-router routes using a koa adapter
const routes = koaAdapter.bind(api.router, spec);

// finally we can create a Koa app from the routes
const app = new Koa();
// we need a bodyparser to make body contain json and deal with multipart requests
app.use(koaBody({ multipart: true }));
app.use(routes.routes());
console.log("Starting server");
// start the server!
app.listen(3000);
