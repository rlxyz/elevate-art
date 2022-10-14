// src/server/router/index.ts
import superjson from 'superjson'
import { createRouter } from './context'

import { collectionRouter } from './core/collection'
import { layerElementRouter } from './core/layer'
import { organisationRouter } from './core/organisation'
import { repositoryRouter } from './core/repository'
import { rulesRouter } from './core/rules'
import { traitElementRouter } from './core/trait'

export const appRouter = createRouter()
  .transformer(superjson)
  .merge('organisation.', organisationRouter)
  .merge('repository.', repositoryRouter)
  .merge('collection.', collectionRouter)
  .merge('layer.', layerElementRouter)
  .merge('trait.', traitElementRouter)
  .merge('rules.', rulesRouter)

// export type definition of API
export type AppRouter = typeof appRouter
