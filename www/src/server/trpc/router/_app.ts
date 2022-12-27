import { router } from '../trpc'
import { collectionRouter } from './collection'
import { contractDeploymentRouter } from './contractDeployment'
import { layerElementRouter } from './layerElement'
import { organisationRouter } from './organisation'
import { repositoryRouter } from './repository'
import { ruleRouter } from './rule'
import { traitElementRouter } from './traitElement'

export const appRouter = router({
  contractDeployment: contractDeploymentRouter,
  organisation: organisationRouter,
  repository: repositoryRouter,
  collection: collectionRouter,
  layerElement: layerElementRouter,
  traitElement: traitElementRouter,
  rule: ruleRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter
