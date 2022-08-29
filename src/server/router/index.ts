// src/server/router/index.ts
import { createRouter } from './context'
import superjson from 'superjson'

import { protectedExampleRouter } from './protected-example-router'
import { organisationRouter } from './organisation'
import { repositoryRouter } from './repository'
import { traitElementRouter } from './trait'
import { layerElementRouter } from './layer'
import { collectionRouter } from './collection'

export const appRouter = createRouter()
  .transformer(superjson)
  .merge('organisation.', organisationRouter)
  .merge('repository.', repositoryRouter)
  // .merge('auth.', protectedExampleRouter)
  .merge('trait.', traitElementRouter)
  .merge('layer.', layerElementRouter)
  .merge('collection.', collectionRouter)

// export type definition of API
export type AppRouter = typeof appRouter
