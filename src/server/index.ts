import * as api from '../../server.generated';
import * as types from '../../common.types.generated';
import * as runtime from '@smartlyio/oats-runtime';
import * as koaAdapter from '@smartlyio/oats-koa-adapter';
import * as Koa from 'koa';
import * as koaBody from 'koa-body';

const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/tonto', {useNewUrlParser: true, useUnifiedTopology: true});

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
  '/test': {
    get: async ctx => {
      return runtime.text(200, 'Test! :)');
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
console.log("Starting server.");
// start the server!
app.listen(3000);