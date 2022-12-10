import { router } from '../trpc'
import { contractDeploymentRouter } from './contractDeployment'

export const appRouter = router({
  contractDeploymentRouter: contractDeploymentRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter
