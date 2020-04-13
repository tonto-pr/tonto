import * as api from '../generated/client.generated';
import * as axiosAdapter from '@smartlyio/oats-axios-adapter';
import * as runtime from '@smartlyio/oats-runtime';
import * as mongoose from 'mongoose';
import { DB_ADDRESS, DB } from '../src/config';
import { PlainFineModel } from '../src/models';
import createApp from '../src/server/app';

describe('Fine', () => {
  mongoose.connect(DB_ADDRESS, {useNewUrlParser: true, useUnifiedTopology: true, dbName: DB})
      .then(async (m) => console.log('Successfully connected to mongodb'))
      .catch(async (err) => console.error(err));

  const server = createApp();
  server.listen(3000);
  const apiClient = api.client(axiosAdapter.bind);

  afterEach(async () => {
    await PlainFineModel.deleteMany({}).exec()
  })
  afterAll(() => {
    mongoose.connection.close();
  })

  describe('/fine', () => {    
    it('creates a fine', async () => {
      await apiClient.fine.post({
        body: runtime.client.json({ receiverName: 'testo', amount: 1000, description: 'sakko.appin kehitys' })
      });
  
      expect(await PlainFineModel.estimatedDocumentCount().exec()).toBe(1)
    })
  })

  describe('/fine/{fineId}', () => {
    it('gets a fine', async () => {
      const fine = await apiClient.fine.post({
        body: runtime.client.json({ receiverName: 'testo', amount: 1000, description: 'sakko.appin kehitys' })
      });

      const gettedFine = await apiClient.fine(fine.value.value._id as string).get();

      expect(gettedFine.value.value._id).toBe(fine.value.value._id);
    })

    it('updates a fine', async () => {
      const fine = await apiClient.fine.post({
        body: runtime.client.json({ receiverName: 'testo', amount: 1000, description: 'sakko.appin kehitys' })
      });

      const gettedFine = await apiClient.fine(fine.value.value._id as string).put({
        body: runtime.client.json({ receiverName: 'testo2', amount: 1000, description: 'sakko.appin kehitys' })
      });

      expect(gettedFine.value.value.receiverName).toBe('testo2');
    })

    it('removes a fine', async () => {
      const fine = await apiClient.fine.post({
        body: runtime.client.json({ receiverName: 'testo', amount: 1000, description: 'sakko.appin kehitys' })
      });
  
      await apiClient.fine(fine.value.value._id as string).delete();
  
      expect(await PlainFineModel.estimatedDocumentCount().exec()).toBe(0)
    })
  })
  
  describe('/fines', () => {
    it('lists all fines', async () => {
      await apiClient.fine.post({
        body: runtime.client.json({ receiverName: 'testo1', amount: 1000, description: 'sakko.appin kehitys' })
      });
      await apiClient.fine.post({
        body: runtime.client.json({ receiverName: 'testo2', amount: 1000, description: 'sakko.appin kehitys' })
      });
      await apiClient.fine.post({
        body: runtime.client.json({ receiverName: 'testo3', amount: 1000, description: 'sakko.appin kehitys' })
      });
  
      const fines = await apiClient.fines.get();

      expect(fines.value.value.length).toBe(3);
    })
  })
})
