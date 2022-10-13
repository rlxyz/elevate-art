// src/pages/api/trpc/[trpc].ts
import { appRouter, createContext, createNextApiHandler } from '@elevateart/api'
import { env } from '../../../env/server.mjs'

// export API handler
export default createNextApiHandler({
  router: appRouter,
  createContext,
  onError:
    env.NODE_ENV === 'development'
      ? ({ path, error }) => {
          console.error(`❌ tRPC failed on ${path}: ${error}`)
        }
      : undefined,
})
