import * as api from "../../generated/server.generated";

import * as koaAdapter from "@smartlyio/oats-koa-adapter";
import * as Koa from "koa";
import * as koaBody from "koa-body";

import * as cors from "@koa/cors";

import { fineEndpoints } from "./fine";
import { userEndpoints } from "./user";
import { userGroupEndpoints } from "./user_group";
import { aclEndpoints } from "./acl";

const spec: api.Endpoints = {
  ...fineEndpoints,
  ...userEndpoints,
  ...userGroupEndpoints,
  ...aclEndpoints,
};

const routes = koaAdapter.bind(api.router, spec);

const createApp = (): Koa => {
  const app = new Koa();

  const corsOptions = {
    origin: "*",
  };

  app.use(cors(corsOptions));
  app.use(koaBody({ multipart: true }));
  app.use(routes.routes());
  console.log("Starting server");

  return app;
};

export default createApp;
