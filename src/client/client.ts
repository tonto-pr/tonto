import * as api from '../../generated/client.generated';
import * as axiosAdapter from '@smartlyio/oats-axios-adapter';
import * as runtime from '@smartlyio/oats-runtime';
import * as assert from 'assert';

// 'api.client' is the abstract implementation of the client which is then mapped to axios requests using 'axiosAdapter'
(async () => {

  const apiClient = api.client(axiosAdapter.bind);

  const fines = await apiClient.fines.get();
  console.log('fines', fines);
  const posted = await apiClient.fine.post({
    body: runtime.client.json({ name: 'testo' })
  });
  console.log('posted', posted)
  if (posted.status !== 200) assert.fail('wrong response');

  const stored = await apiClient.fine(posted.value.value._id).get();
  if (stored.status !== 200) assert.fail('wrong response');
  console.log('stored', stored)
  const putted = await apiClient.fine(posted.value.value._id).put({
    body: runtime.client.json({ name: 'anton' })
  });
  console.log('putted', putted)
  const stored2 = await apiClient.fine(posted.value.value._id).get();
  console.log('stored2', stored2)
  const deleted = await apiClient.fine(posted.value.value._id).delete();
  console.log('deleted', deleted)
  assert(deleted.status === 200);
})();