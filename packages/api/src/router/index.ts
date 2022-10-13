// src/server/router/index.ts
import superjson from "superjson";
import { createRouter } from "../context";

import { collectionRouter } from "./collection";
import { layerElementRouter } from "./layer";
import { organisationRouter } from "./organisation";
import { repositoryRouter } from "./repository";
import { rulesRouter } from "./rules";
import { traitElementRouter } from "./trait";

export const appRouter = createRouter()
  .transformer(superjson)
  .merge("organisation.", organisationRouter)
  .merge("repository.", repositoryRouter)
  .merge("collection.", collectionRouter)
  .merge("layer.", layerElementRouter)
  .merge("trait.", traitElementRouter)
  .merge("rules.", rulesRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
