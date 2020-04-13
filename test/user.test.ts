import * as api from '../generated/client.generated';
import * as axiosAdapter from '@smartlyio/oats-axios-adapter';
import * as runtime from '@smartlyio/oats-runtime';
import * as mongoose from 'mongoose';
import { DB_ADDRESS, DB } from '../src/config';
import { PlainUserModel } from '../src/models';
import createApp from '../src/server/app';

describe('User', () => {
  mongoose.connect(DB_ADDRESS, {useNewUrlParser: true, useUnifiedTopology: true, dbName: DB})
      .then(async (m) => console.log('Successfully connected to mongodb'))
      .catch(async (err) => console.error(err));

  const app = createApp();
  const server = app.listen(3000);
  const apiClient = api.client(axiosAdapter.bind);

  afterEach(async () => {
    await PlainUserModel.deleteMany({}).exec()
  })
  afterAll(() => {
    mongoose.connection.close();
    server.close();
  })

  describe('/user', () => {    
    it('creates a user', async () => {
      await apiClient.user.post({
        body: runtime.client.json({ email: 'testo@tmc.fi', username: 'testo', password: 'abcd' })
      });
  
      expect(await PlainUserModel.estimatedDocumentCount().exec()).toBe(1)
    })
  })

  describe('/user/{userId}', () => {
    it('gets a user', async () => {
      const user = await apiClient.user.post({
        body: runtime.client.json({ email: 'testo@tmc.fi', username: 'testo', password: 'abcd' })
      });

      const getteduser = await apiClient.user(user.value.value._id as string).get();

      expect(getteduser.value.value._id).toBe(user.value.value._id);
    })

    it('removes a user', async () => {
      const user = await apiClient.user.post({
        body: runtime.client.json({ email: 'testo@tmc.fi', username: 'testo', password: 'abcd' })
      });
  
      await apiClient.user(user.value.value._id as string).delete();
  
      expect(await PlainUserModel.estimatedDocumentCount().exec()).toBe(0)
    })
  })
  
  describe('/users', () => {
    it('lists all users', async () => {
      await apiClient.user.post({
        body: runtime.client.json({ email: 'testo1@tmc.fi', username: 'testo1', password: 'abcd' })
      });
      await apiClient.user.post({
        body: runtime.client.json({ email: 'testo2@tmc.fi', username: 'testo2', password: 'abcd' })
      });
      await apiClient.user.post({
        body: runtime.client.json({ email: 'testo3@tmc.fi', username: 'testo3', password: 'abcd' })
      });
  
      const users = await apiClient.users.get();

      expect(users.value.value.length).toBe(3);
    })
  })
})
