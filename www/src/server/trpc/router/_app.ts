import { router } from '../trpc'
import { traitElementRouter } from './traitElement'

export const appRouter = router({
  organisation: traitElementRouter,
  repository: traitElementRouter,
  collection: traitElementRouter,
  layerElement: traitElementRouter,
  traitElement: traitElementRouter,
  rule: traitElementRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter
