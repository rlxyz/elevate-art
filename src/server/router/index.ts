// src/server/router/index.ts
import superjson from 'superjson'
import { createRouter } from './context'

import { collectionRouter } from './collection'
import { layerElementRouter } from './layer'
import { organisationRouter } from './organisation'
import { repositoryRouter } from './repository'
import { traitElementRouter } from './trait'

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
