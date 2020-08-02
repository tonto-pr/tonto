import * as api from '../generated/client.generated';
import * as axiosAdapter from '@smartlyio/oats-axios-adapter';
import * as runtime from '@smartlyio/oats-runtime';
import createApp from '../src/server/app';
import { makeFine } from './factory';

import { knex } from '../db/database';

describe('Fine', () => {
  const app = createApp();
  const server = app.listen(3000);
  const apiClient = api.client(axiosAdapter.bind);

  afterEach(async () => {
    await knex('dim_fines').del()
  })
  afterAll(async () => {
    await knex.destroy()
    server.close();
  })

  describe('/fine', () => {    
    it('creates a fine', async () => {
      await apiClient.fine.post({
        body: runtime.client.json({ amount: 1000, description: 'sakko.appin kehitys' })
      });
      const count = parseInt((await knex('dim_fines').count())[0].count as string)
      expect(count).toBe(1)
    })
  })

  describe('/fine/{fineId}', () => {
    it('gets a fine', async () => {
      const fine = await makeFine()

      const gettedFine = await apiClient.fine(fine.fine_id.toString()).get();

      expect(gettedFine.value.value.fine_id).toBe(fine.fine_id);
    })

    it('updates a fine', async () => {
      const fine = await makeFine()

      const gettedFine = await apiClient.fine(fine.fine_id.toString()).put({
        body: runtime.client.json({ amount: 1000, description: 'sakko.appin kehitys viivästyy' })
      });

      expect(gettedFine.value.value.description).toBe('sakko.appin kehitys viivästyy');
    })

    it('removes a fine', async () => {
      const fine = await makeFine()
  
      await apiClient.fine(fine.fine_id.toString()).delete();
      const count = parseInt((await knex('dim_fines').count())[0].count as string)
      expect(count).toBe(0)
    })
  })
  
  describe('/fines', () => {
    it('lists all fines', async () => {
      await makeFine()
      await makeFine({ description: 'testo2' })
      await makeFine({ description: 'testo3' })
  
      const fines = await apiClient.fines.get();

      expect(fines.value.value.length).toBe(3);
    })
  })
})
