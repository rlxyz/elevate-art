import { router } from '../trpc'
import { collectionRouter } from './collection'
import { layerElementRouter } from './layerElement'
import { repositoryRouter } from './repository'
import { ruleRouter } from './rule'
import { traitElementRouter } from './traitElement'

export const appRouter = router({
  // organisation: traitElementRouter,
  repository: repositoryRouter,
  collection: collectionRouter,
  layerElement: layerElementRouter,
  traitElement: traitElementRouter,
  rule: ruleRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter
