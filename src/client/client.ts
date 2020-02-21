import * as api from '../../client.generated';
import * as axiosAdapter from '@smartlyio/oats-axios-adapter';
import * as runtime from '@smartlyio/oats-runtime';
import * as assert from 'assert';

// 'api.client' is the abstract implementation of the client which is then mapped to axios requests using 'axiosAdapter'
(async () => {
  const apiClient = api.client(axiosAdapter.bind);

  const posted = await apiClient.entity.post({
    body: runtime.client.json({ id: '1', name: 'name' })
  });
  if (posted.status !== 200) assert.fail('wrong response');
  console.log(posted);
  const stored = await apiClient.entity(posted.value.value.id).get();
  if (stored.status !== 200) assert.fail('wrong response');
  assert(stored.value.value.id === '1');

  const deleted = await apiClient.entity(posted.value.value.id).delete();
  assert(deleted.status === 200);
})();