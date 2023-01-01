import { router } from '../trpc'
import { collectionRouter } from './collection'
import { contractDeploymentRouter } from './contractDeployment'
import { contractDeploymentWhitelistRouter } from './contractDeploymentWhitelist'
import { layerElementRouter } from './layerElement'
import { organisationRouter } from './organisation'
import { repositoryRouter } from './repository'
import { ruleRouter } from './rule'
import { traitElementRouter } from './traitElement'
import { whitelistRouter } from './whitelist'

export const appRouter = router({
  contractDeploymentWhitelist: contractDeploymentWhitelistRouter,
  contractDeployment: contractDeploymentRouter,
  organisation: organisationRouter,
  repository: repositoryRouter,
  collection: collectionRouter,
  layerElement: layerElementRouter,
  traitElement: traitElementRouter,
  rule: ruleRouter,
  whitelist: whitelistRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter
