import * as api from '../../generated/server.generated';
import * as types from '../../generated/common.types.generated';
import * as runtime from '@smartlyio/oats-runtime';
import * as koaAdapter from '@smartlyio/oats-koa-adapter';
import * as Koa from 'koa';
import * as koaBody from 'koa-body';
import * as bcrypt from 'bcryptjs';
import * as cors from '@koa/cors';
import * as cryptoRandom from 'crypto-random-string';

import { knex } from '../../db/database';

const spec: api.Endpoints = {
  '/fine': {
    post: async ctx => {
      if (ctx.body.value.amount > 2000000000) {
        return runtime.json(500, { message: 'Amount is too large. Please submit an amount less than 2 Billion.', status: 500})
      }
      const fines: types.ShapeOfFine[] = await knex('dim_fines').returning('*').insert(ctx.body.value as types.ShapeOfPlainFine)

      if (fines.length > 0) {
        return runtime.json(200, fines[0]);
      }
      return runtime.json(404, { message: 'not found', status: 404 })
    }
  },
  '/fine/{fine_id}': {
    delete: async ctx => {
      const fines: types.ShapeOfFine[] = await knex('dim_fines').where({ fine_id: parseInt(ctx.params.fine_id)}).returning('*').del()

      if (fines.length > 0) {
        return runtime.json(200, fines[0]);
      }
      return runtime.json(404, { message: 'not found', status: 404 });
    },
    get: async ctx => {
      const fines: types.ShapeOfFine[] = await knex('dim_fines').select('*').where({ fine_id: parseInt(ctx.params.fine_id)})
      
      if (fines.length > 0) {
        return runtime.json(200, fines[0]);
      }
      return runtime.json(404, { message: 'not found', status: 404 });
    },
    put: async ctx => {
      const fines: types.ShapeOfFine[] = await knex('dim_fines').where({ fine_id: ctx.params.fine_id}).returning('*').update(ctx.body.value as types.ShapeOfPlainFine)

      if (fines.length > 0) {
        return runtime.json(200, fines[0]);
      }
      return runtime.json(404, { message: 'not found', status: 404 });
    }
  },
  '/fines': {
    get: async ctx => {
      const fines: types.ShapeOfFine[] = await knex('dim_fines').select('*');

      if (fines) {
        return runtime.json(200, fines);
      }
      return runtime.json(404, { message: 'not found', status: 404 });
    }
  },
  '/user': {
    post: async ctx => {
      const existing_user: types.ShapeOfUser[] = await knex('dim_users').select('*').where({ username: ctx.body.value.username })

      if (existing_user.length > 0) {
        return runtime.json(403, { message: 'username already exists', status: 403 })
      }

      if (!ctx.body.value.password) {
        return runtime.json(500, { message: 'please provide a password', status: 500 })
      }

      const encrypted_user = { ...ctx.body.value }

      encrypted_user.password = bcrypt.hashSync(ctx.body.value.password, 10);
      encrypted_user.access_token = cryptoRandom({length: 30});
      const users: types.ShapeOfUser[] = await knex('dim_users').returning(['user_id', 'username', 'access_token', 'email']).insert(encrypted_user as types.ShapeOfPlainUser)
      if (users.length > 0) {        
        return runtime.json(200, users[0]);
      }
      return runtime.json(404, { message: 'not found', status: 404 })
    }
  },
  '/user/{user_id}': {
    delete: async ctx => {
      const users: types.ShapeOfUser[] = await knex('dim_users').where({ user_id: parseInt(ctx.params.user_id) }).returning(['user_id', 'username', 'email']).del()

      if (users.length > 0) {
        return runtime.json(200, users[0]);
      }
      return runtime.json(404, { message: 'not found', status: 404 });
    },
    get: async ctx => {
      const users: types.ShapeOfUser[] = await knex('dim_users').select(['user_id', 'username', 'email']).where({ user_id: parseInt(ctx.params.user_id) })

      if (users.length > 0) {
        return runtime.json(200, users[0]);
      }
      return runtime.json(404, { message: 'not found', status: 404 });
    }
  },
  '/users': {
    get: async ctx => {
      const users: types.ShapeOfUser[] = await knex('dim_users').select(['user_id', 'username', 'email']);
      
      if (users.length > 0) {
        return runtime.json(200, users);
      }
      return runtime.json(404, { message: 'not found', status: 404 });
    }
  },
  // '/group': {
  //   post: async ctx => {
  //     const groupBody = { ...ctx.body.value };

  //     if (!groupBody.members) {
  //       groupBody.members = []
  //     }

  //     const existing_group = await PlainGroupModel.findOne({ groupName: ctx.body.value.groupName }).exec();

  //     if (existing_group) {
  //       return runtime.json(403, { message: 'group name already exists', status: 403 })
  //     }

  //     const temp_group = await PlainGroupModel.create(groupBody as types.ShapeOfPlainGroup);

  //     if (temp_group) {
  //       const group: types.ShapeOfGroup = {...temp_group.toObject(), _id: temp_group.id}
  //       return runtime.json(200, group);
  //     }
  //     return runtime.json(404, { message: 'not found', status: 404 })
  //   }
  // },
  // '/group/{groupId}': {
  //   delete: async ctx => {
  //     const temp_group = await PlainGroupModel.findOneAndDelete({ _id: ctx.params.groupId });

  //     if (temp_group) {
  //       const group: types.ShapeOfGroup = {...temp_group.toObject(), _id: temp_group.id}
  //       return runtime.json(200, group);
  //     }
  //     return runtime.json(404, { message: 'not found', status: 404 });
  //   },
  //   get: async ctx => {
  //     let temp_group = await PlainGroupModel.findById(ctx.params.groupId).exec();

  //     if (temp_group) {
  //       const group: types.ShapeOfGroup = {...temp_group.toObject(), _id: temp_group.id}
  //       return runtime.json(200, group);
  //     }
  //     return runtime.json(404, { message: 'not found', status: 404 });
  //   }
  // },
  // '/group/{groupId}/members': {
  //   get: async ctx => {
  //     let temp_group = await PlainGroupModel.findById(ctx.params.groupId).exec();

  //     if (!temp_group) {
  //       return runtime.json(404, { message: 'not found', status: 404 });
  //     }

  //     const groupMembers = await PlainUserModel.find({_id: { $in: temp_group.members }}).select('-password').exec();

  //     if (groupMembers) {
  //       const users = groupMembers.map((temp_user: any) => {
  //         const user: types.ShapeOfUser = {...temp_user.toObject(), _id: temp_user.id}
  //         return user
  //       })
  //       return runtime.json(200, users);
  //     }
  //     return runtime.json(404, { message: 'not found', status: 404 });
  //   }
  // },
  // '/groups': {
  //   get: async ctx => {
  //     const temp_groups = await PlainGroupModel.find({});

  //     if (temp_groups) {
  //       const groups = temp_groups.map((group: any) => {
  //         return {...group.toObject(), _id: group.id} as types.ShapeOfGroup
  //       })
  //       return runtime.json(200, groups);
  //     }
  //     return runtime.json(404, { message: 'not found', status: 404 });
  //   }
  // },
  '/login': {
    post: async ctx => {
      if (ctx.body.value.access_token) {
        const users: types.ShapeOfUser[] = await knex('dim_users').select(['user_id', 'username', 'email']).where({ access_token: ctx.body.value.access_token })

        if (users.length === 1) {
          return runtime.json(200, users[0])
        }
      }

      const users: types.ShapeOfUser[] = await knex('dim_users').where({ username: ctx.body.value.username }).returning(['user_id', 'username', 'email', 'password']).update({ access_token: cryptoRandom({length: 30}) })

      if (users.length === 1) {
        const { password, ...user } = users[0]
        if (!ctx.body.value.password) {
          return runtime.json(500, { message: 'please provide a password', status: 500 });
        }
        if(password && !bcrypt.compareSync(ctx.body.value.password, password)) {
          return runtime.json(401, { message: 'unauthorized', status: 401 });
        } else {
          return runtime.json(200, user);
        }
      } else if (users.length > 1) {
        console.log('Duplicate users found');
      }
      return runtime.json(404, { message: 'not found', status: 404 });
    }
  },
  '/test': {
    get: async ctx => {
      const fines: types.ShapeOfFine[] = await knex('dim_fines').returning('*').insert({amount: 10, description: 'sakko.appin laiminlyönti'} as types.ShapeOfPlainFine)
      const users: types.ShapeOfUser[] = await knex('dim_users').returning(['user_id', 'username', 'email']).insert({ email: 'testo@tmc.fi', username: 'testo', password: 'abcde' } as types.ShapeOfPlainUser)
      const fine = fines[0]
      const user = users[0]
      console.log(user)
      return runtime.text(200, `${fine.fine_id} + ${fine.amount} + ${fine.description}`);
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