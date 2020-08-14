import * as api from "../../generated/client.generated";
import * as axiosAdapter from "@smartlyio/oats-axios-adapter";
import * as runtime from "@smartlyio/oats-runtime";
// import * as types from "../../generated/common.types.generated";
// import * as assert from "assert";

// 'api.client' is the abstract implementation of the client which is then mapped to axios requests using 'axiosAdapter'
(async () => {
  const apiClient = api.client(axiosAdapter.bind);

  // const user1 = await apiClient.user.post({
  //   body: runtime.client.json({
  //     username: "anton1",
  //     email: "testo1@test.fi",
  //     password: "deadbeef",
  //   }),
  // });

  // const user2 = await apiClient.user.post({
  //   body: runtime.client.json({
  //     username: "anton2",
  //     email: "testo2@test.fi",
  //     password: "deadbeef",
  //   }),
  // });

  // const userGroup1 = await apiClient.user_group.post({
  //   body: runtime.client.json({
  //     users: [20, 21] as number[],
  //     user_group_name: "MJTJP1",
  //   }),
  // });

  // const userGroup2 = await apiClient.user_group.post({
  //   body: runtime.client.json({
  //     users: [20, 21] as number[],
  //     user_group_name: "MJTJP2",
  //   }),
  // });

  // await apiClient.fine.post({
  //   body: runtime.client.json({
  //     amount: 9999,
  //     description: "SAKKO!",
  //   }),
  // });

  // await apiClient.user.post({
  //   body: runtime.client.json({
  //     username: "TESTOASDSDAAD",
  //     email: "TESTO@antonraut.ASDSADio",
  //     password: "hehe",
  //   }),
  // });

  // await apiClient.user_group.post({
  //   body: runtime.client.json({
  //     user_group_name: "MJTJP2ASD!KEKEKASAD",
  //   }),
  // });
  // const givenFine = await apiClient.fine.give.post({
  //   body: runtime.client.json({
  //     fine_id: 21,
  //     giver_user_id: 19,
  //     receiver_user_id: 20,
  //     user_group_id: 20,
  //   }),
  // });

  // console.log(givenFine);
  const user = await apiClient.user.post({
    body: runtime.client.json({
      email: "testo@tmc.fi",
      username: "testoaaa",
      password: "abcd",
    }),
  });

  console.log(user);
  // console.log(userGroup);

  // const fines = await apiClient.fines.get();
  // console.log('fines', fines);
  // const posted = await apiClient.fine.post({
  //   body: runtime.client.json({ amount: 1999999999, description: 'sakko.appin kehitys' })
  // });
  // console.log('posted', posted)
  // console.log(typeof(posted.value.value.fine_id))
  // if (posted.status !== 200) assert.fail('wrong response');

  // const stored = await apiClient.fine(posted.value.value.fine_id.toString()).get();
  // console.log(stored)
  // if (stored.status !== 200) assert.fail('wrong response');
  // console.log('stored', stored)
  // const putted = await apiClient.fine(posted.value.value._id).put({
  //   body: runtime.client.json({ receiverName: 'anton', amount: 1000, description: 'sakko.appin kehitys'})
  // });
  // assert(putted.value.value.receiverName === 'anton')
  // console.log('putted', putted)
  // const stored2 = await apiClient.fine(posted.value.value.fineId).get();
  // console.log('stored2', stored2)
  // const deleted = await apiClient.fine(posted.value.value.fineId).delete();
  // console.log('deleted', deleted)
  // assert(deleted.status === 200);
})();
