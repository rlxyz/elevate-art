// src/server/router/index.ts
import superjson from 'superjson'
import { createRouter } from './context'

import { traitElementRouter } from '../trpc/router/traitElement'
import { collectionRouter } from './core/collection'
import { layerElementRouter } from './core/layers'
import { organisationRouter } from './core/organisation'
import { repositoryRouter } from './core/repository'
import { rulesRouter } from './core/rules'

export const appRouter = createRouter()
  .transformer(superjson)
  .merge('organisation.', organisationRouter)
  .merge('repository.', repositoryRouter)
  .merge('collections.', collectionRouter)
  .merge('layers.', layerElementRouter)
  .merge('traits.', traitElementRouter)
  .merge('rules.', rulesRouter)

// export type definition of API
export type AppRouter = typeof appRouter
