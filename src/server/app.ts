import * as api from '../../generated/server.generated';
import * as types from '../../generated/common.types.generated';
import * as runtime from '@smartlyio/oats-runtime';
import * as koaAdapter from '@smartlyio/oats-koa-adapter';
import * as Koa from 'koa';
import * as koaBody from 'koa-body';
import * as bcrypt from 'bcryptjs';
import * as cors from '@koa/cors';
import * as cryptoRandom from 'crypto-random-string';

import { PlainFineModel, PlainUserModel, PlainGroupModel } from '../models';

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
      const temp_fines = await PlainFineModel.find({}).exec();

      if (temp_fines) {
        const fines = temp_fines.map((fine: any) => {
          return {...fine.toObject(), _id: fine.id} as types.ShapeOfFine
        })
        return runtime.json(200, fines);
      }
      return runtime.json(404, { message: 'not found', status: 404 });
    }
  },
  '/user': {
    post: async ctx => {
      const existing_user = await PlainUserModel.findOne({ username: ctx.body.value.username }).exec();

      if (existing_user) {
        return runtime.json(403, { message: 'username already exists', status: 403 })
      }

      if (!ctx.body.value.password) {
        return runtime.json(500, { message: 'please provide a password', status: 500 })
      }

      const encrypted_user = { ...ctx.body.value }
      console.log(encrypted_user)
      encrypted_user.password = bcrypt.hashSync(ctx.body.value.password, 10);
      encrypted_user.accessToken = cryptoRandom({length: 30});
      const temp_user = await PlainUserModel.create(encrypted_user as types.ShapeOfPlainUser);
      console.log(temp_user)
      if (temp_user) {
        const userObject = temp_user.toObject();
        delete userObject.password
        
        const user: types.ShapeOfUser = {...userObject, _id: temp_user.id}
        return runtime.json(200, user);
      }
      return runtime.json(404, { message: 'not found', status: 404 })
    }
  },
  '/user/{userId}': {
    delete: async ctx => {
      const temp_user = await PlainUserModel.findOneAndDelete({ _id: ctx.params.userId }).exec();

      if (temp_user) {
        const user: types.ShapeOfUser = {...temp_user.toObject(), _id: temp_user.id}
        return runtime.json(200, user);
      }
      return runtime.json(404, { message: 'not found', status: 404 });
    },
    get: async ctx => {
      let temp_user = await PlainUserModel.findById(ctx.params.userId).select("-password -accessToken").exec();

      if (temp_user) {
        const user: types.ShapeOfUser = {...temp_user.toObject(), _id: temp_user.id}
        return runtime.json(200, user);
      }
      return runtime.json(404, { message: 'not found', status: 404 });
    }
  },
  '/users': {
    get: async ctx => {
      const temp_users = await PlainUserModel.find({}).select("-password -accessToken").exec();

      if (temp_users) {
        const users = temp_users.map((temp_user: any) => {
          const user: types.ShapeOfUser = {...temp_user.toObject(), _id: temp_user.id}
          return user
        })
        return runtime.json(200, users);
      }
      return runtime.json(404, { message: 'not found', status: 404 });
    }
  },
  '/group': {
    post: async ctx => {
      const groupBody = { ...ctx.body.value };

      if (!groupBody.members) {
        groupBody.members = []
      }

      const existing_group = await PlainGroupModel.findOne({ groupName: ctx.body.value.groupName }).exec();

      if (existing_group) {
        return runtime.json(403, { message: 'group name already exists', status: 403 })
      }

      const temp_group = await PlainGroupModel.create(groupBody as types.ShapeOfPlainGroup);

      if (temp_group) {
        const group: types.ShapeOfGroup = {...temp_group.toObject(), _id: temp_group.id}
        return runtime.json(200, group);
      }
      return runtime.json(404, { message: 'not found', status: 404 })
    }
  },
  '/group/{groupId}': {
    delete: async ctx => {
      const temp_group = await PlainGroupModel.findOneAndDelete({ _id: ctx.params.groupId });

      if (temp_group) {
        const group: types.ShapeOfGroup = {...temp_group.toObject(), _id: temp_group.id}
        return runtime.json(200, group);
      }
      return runtime.json(404, { message: 'not found', status: 404 });
    },
    get: async ctx => {
      let temp_group = await PlainGroupModel.findById(ctx.params.groupId).exec();

      if (temp_group) {
        const group: types.ShapeOfGroup = {...temp_group.toObject(), _id: temp_group.id}
        return runtime.json(200, group);
      }
      return runtime.json(404, { message: 'not found', status: 404 });
    }
  },
  '/group/{groupId}/members': {
    get: async ctx => {
      let temp_group = await PlainGroupModel.findById(ctx.params.groupId).exec();

      if (!temp_group) {
        return runtime.json(404, { message: 'not found', status: 404 });
      }

      const groupMembers = await PlainUserModel.find({_id: { $in: temp_group.members }}).select('-password').exec();

      if (groupMembers) {
        const users = groupMembers.map((temp_user: any) => {
          const user: types.ShapeOfUser = {...temp_user.toObject(), _id: temp_user.id}
          return user
        })
        return runtime.json(200, users);
      }
      return runtime.json(404, { message: 'not found', status: 404 });
    }
  },
  '/groups': {
    get: async ctx => {
      const temp_groups = await PlainGroupModel.find({});

      if (temp_groups) {
        const groups = temp_groups.map((group: any) => {
          return {...group.toObject(), _id: group.id} as types.ShapeOfGroup
        })
        return runtime.json(200, groups);
      }
      return runtime.json(404, { message: 'not found', status: 404 });
    }
  },
  '/login': {
    post: async ctx => {
      if (ctx.body.value.accessToken) {
        const user = await PlainUserModel.findOne({ accessToken: ctx.body.value.accessToken }).select("-password").exec();
        if (user) {
          const finalUser: types.ShapeOfUser = {...user.toObject(), _id: user.id}
          return runtime.json(200, finalUser)
        }
      }

      const user = await PlainUserModel.findOneAndUpdate({ username: ctx.body.value.username }, { accessToken: cryptoRandom({length: 30}) }, { new: true });
      
      if (user) {
        if (!ctx.body.value.password) {
          return runtime.json(500, { message: 'please provide a password', status: 500 });
        }
        if(user.password && !bcrypt.compareSync(ctx.body.value.password, user.password)) {
          return runtime.json(401, { message: 'unauthorized', status: 401 });
        } else {
          const finalUser: types.ShapeOfUser = {...user.toObject(), _id: user.id}
          console.log(finalUser)
          return runtime.json(200, finalUser);
        }
      }
      return runtime.json(404, { message: 'not found', status: 404 });
    }
  },
  '/test': {
    get: async ctx => {
      const fine: types.ShapeOfFine = await PlainFineModel.create({receiverName: 'sihteeri', amount: 10, description: 'sakko.appin laiminlyönti'} as types.ShapeOfPlainFine);
      const user: types.ShapeOfUser = await PlainUserModel.create({ email: 'testo@tmc.fi', username: 'testo', password: 'abcde' } as types.ShapeOfPlainUser);
      console.log(user)
      return runtime.text(200, `${fine._id} + ${fine.receiverName} + ${fine.amount} + ${fine.description}`);
    }
  }
};

const routes = koaAdapter.bind(api.router, spec);

const createApp = (): Koa => {
  const app = new Koa();

  const corsOptions = {
    origin: '*'
  };

  app.use(cors(corsOptions));
  app.use(koaBody({ multipart: true }));
  app.use(routes.routes());
  console.log("Starting server");

  return app;
}

export default createApp;