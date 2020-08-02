import * as api from '../generated/client.generated';
import * as axiosAdapter from '@smartlyio/oats-axios-adapter';
import * as runtime from '@smartlyio/oats-runtime';

import createApp from '../src/server/app';
import { makeUser } from './factory';

import { knex } from '../db/database';

describe('User', () => {
  const app = createApp();
  const server = app.listen(3000);
  const apiClient = api.client(axiosAdapter.bind);

  afterEach(async () => {
    await knex('dim_users').del()
  })
  afterAll(async () => {
    await knex.destroy()
    server.close();
  })

  describe('/user', () => {    
    it('creates a user', async () => {
      await apiClient.user.post({
        body: runtime.client.json({ email: 'testo@tmc.fi', username: 'testo', password: 'abcd' })
      })
      const count = parseInt((await knex('dim_users').count())[0].count as string)
      expect(count).toBe(1)
    })
  })

  describe('/user/{userId}', () => {
    it('gets a user', async () => {
      const user = await makeUser();

      const getteduser = await apiClient.user(user.user_id.toString()).get();

      expect(getteduser.value.value.user_id).toBe(user.user_id);
    })

    it('removes a user', async () => {
      const user = await makeUser();
  
      await apiClient.user(user.user_id.toString()).delete();
      const count = parseInt((await knex('dim_users').count())[0].count as string)
      expect(count).toBe(0)
    })
  })
  
  describe('/users', () => {
    it('lists all users', async () => {
      await makeUser();
      await makeUser({ username: 'testo2' });
      await makeUser({ username: 'testo3' });
  
      const users = await apiClient.users.get();

      expect(users.value.value.length).toBe(3);
    })
  })
})
