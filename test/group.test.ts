import * as api from '../generated/client.generated';
import * as axiosAdapter from '@smartlyio/oats-axios-adapter';
import * as runtime from '@smartlyio/oats-runtime';
import * as mongoose from 'mongoose';
import { DB_ADDRESS, DB } from '../src/config';
import { PlainGroupModel, PlainUserModel } from '../src/models';
import createApp from '../src/server/app';
import make from './factory';

describe('Group', () => {
  mongoose.connect(DB_ADDRESS, {useNewUrlParser: true, useUnifiedTopology: true, dbName: DB})
      .then(async (m) => console.log('Successfully connected to mongodb'))
      .catch(async (err) => console.error(err));

  const app = createApp();
  const server = app.listen(3000);
  const apiClient = api.client(axiosAdapter.bind);

  afterEach(async () => {
    await PlainGroupModel.deleteMany({}).exec()
    await PlainUserModel.deleteMany({}).exec()
  })
  afterAll(() => {
    mongoose.connection.close();
    server.close();
  })

  describe('/group', () => {    
    it('creates a group', async () => {
      await apiClient.group.post({
        body: runtime.client.json({ members: [] as readonly string[], groupName: 'MJTJP' })
      });
  
      expect(await PlainGroupModel.estimatedDocumentCount().exec()).toBe(1)
    })
  })

  describe('/group/{groupId}', () => {
    it('gets a group', async () => {
      const group = await make('group')

      const gettedgroup = await apiClient.group(group._id as string).get();

      expect(gettedgroup.value.value._id).toBe(group._id);
    })

    it('removes a group', async () => {
      const group = await make('group')
  
      await apiClient.group(group._id as string).delete();
  
      expect(await PlainGroupModel.estimatedDocumentCount().exec()).toBe(0)
    })
  })
  
  describe('/group/{groupId}/members', () => {
      it('lists all members of a group', async () => {
        const postedUser = await make('user')
        const postedUser2 = await make('user', { username: 'testo2' })

        const group = await make('group', { members: [postedUser._id, postedUser2._id]})

        const groupMembers = await apiClient.group(group._id as string).members.get();

        expect(groupMembers.value.value.length).toBe(2);
      })
  })

  describe('/groups', () => {
    it('lists all groups', async () => {
      await make('group')
      await make('group', { groupName: 'MJTJP2' })
      await make('group', { groupName: 'MJTJP3' })

      const groups = await apiClient.groups.get();

      expect(groups.value.value.length).toBe(3);
    })
  })
})
