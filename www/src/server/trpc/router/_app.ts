import { router } from '../trpc'
import { layerElementRouter } from './layerElement'
import { traitElementRouter } from './traitElement'

export const appRouter = router({
  // organisation: traitElementRouter,
  // repository: traitElementRouter,
  // collection: traitElementRouter,
  layerElement: layerElementRouter,
  traitElement: traitElementRouter,
  // rule: traitElementRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter
