import * as api from '../../generated/server.generated';
import * as types from '../../generated/common.types.generated';
import * as runtime from '@smartlyio/oats-runtime';
import * as koaAdapter from '@smartlyio/oats-koa-adapter';
import * as Koa from 'koa';
import * as koaBody from 'koa-body';
import * as mongoose from 'mongoose';
import { DB_ADDRESS } from '../config';

import { getModelForClass } from '@typegoose/typegoose';
import { injectProps } from './injector';

mongoose.connect(DB_ADDRESS, {useNewUrlParser: true, useUnifiedTopology: true, dbName: 'tonto'})
  .then((m) => console.log('Successfully connected to mongodb'))
  .catch((err) => console.error(err));

injectProps(types.PlainFine, [{ name: 'name', type: 'string'}])

const PlainFineModel = getModelForClass(types.PlainFine);

const spec: api.Endpoints = {
  '/fine': {
    post: async ctx => {
      const temp_fine = await PlainFineModel.create(ctx.body.value as types.ShapeOfPlainFine);

      if (temp_fine) {
        const fine: types.ShapeOfFine = {...temp_fine.toObject(), _id: temp_fine.id}
        return runtime.json(200, fine);
      }
      return runtime.json(404, { message: 'not found', status: 404 })
    }
  },
  '/fine/{fineId}': {
    delete: async ctx => {
      const temp_fine = await PlainFineModel.findOneAndDelete({ _id: ctx.params.fineId });

      if (temp_fine) {
        const fine: types.ShapeOfFine = {...temp_fine.toObject(), _id: temp_fine.id}
        return runtime.json(200, fine);
      }
      return runtime.json(404, { message: 'not found', status: 404 });
    },
    get: async ctx => {
      let temp_fine = await PlainFineModel.findById(ctx.params.fineId).exec();

      if (temp_fine) {
        const fine: types.ShapeOfFine = {...temp_fine.toObject(), _id: temp_fine.id}
        return runtime.json(200, fine);
      }
      return runtime.json(404, { message: 'not found', status: 404 });
    },
    put: async ctx => {
      const temp_fine = await PlainFineModel.findOneAndUpdate({ _id: ctx.params.fineId }, ctx.body.value, { upsert: true, new: true }).exec();

      if (temp_fine) {
        const fine: types.ShapeOfFine = {...temp_fine.toObject(), _id: temp_fine.id}
        return runtime.json(200, fine);
      }
      return runtime.json(404, { message: 'not found', status: 404 });
    }
  },
  '/fines': {
    get: async ctx => {
      const temp_fines = await PlainFineModel.find({});

      if (temp_fines) {
        const fines = temp_fines.map(fine => {
          return {...fine.toObject(), _id: fine.id} as types.ShapeOfFine
        })
        return runtime.json(200, fines);
      }
      return runtime.json(404, { message: 'not found', status: 404 });
    }
  },
  '/test': {
    get: async ctx => {
      const fine: types.ShapeOfFine = await PlainFineModel.create({name: 'hello'} as types.ShapeOfPlainFine);

      return runtime.text(200, `${fine._id} + ${fine?.name}`);
    }
  }
};

const routes = koaAdapter.bind(api.router, spec);

const app = new Koa();

app.use(koaBody({ multipart: true }));
app.use(routes.routes());
console.log("Starting server");

app.listen(3000);
