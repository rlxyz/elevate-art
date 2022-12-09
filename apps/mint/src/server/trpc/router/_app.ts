import { router } from '../trpc'
import { repositoryRouter } from './repository'

export const appRouter = router({
  repository: repositoryRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter
