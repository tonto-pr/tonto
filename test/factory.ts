import * as api from "../generated/client.generated";
import * as axiosAdapter from "@smartlyio/oats-axios-adapter";
import * as runtime from "@smartlyio/oats-runtime";

const apiClient = api.client(axiosAdapter.bind);

export const makeUser = async (props: object = {}) => {
  const user = await apiClient.user.post({
    body: runtime.client.json({
      email: "testo@tmc.fi",
      username: "testo",
      password: "abcd",
      access_token: "token123",
      ...props,
    }),
  });

  if (user.status === 200) {
    return user.value.value;
  } else {
    throw user.value;
  }
};

export const makeFine = async (props: object = {}) => {
  const fine = await apiClient.fine.post({
    body: runtime.client.json({
      amount: 1000,
      description: "sakko.appin kehitys",
      ...props,
    }),
  });

  if (fine.status === 200) {
    return fine;
  } else {
    throw fine.value;
  }
};

export const makeUserGroup = async (props: object = {}) => {
  const userGroup = await apiClient.user_group.post({
    body: runtime.client.json({
      user_group_name: "MJTJP",
      ...props,
    }),
  });

  if (userGroup.status === 200) {
    return userGroup.value.value;
  } else {
    throw userGroup.value;
  }
};
