// src/pages/api/trpc/[trpc].ts
<<<<<<< HEAD
import { createNextApiHandler } from '@trpc/server/adapters/next'
import { env } from '../../../env/server.mjs.js.js'
import { appRouter } from '../../../server/router'
import { createContext } from '../../../server/router/context'
=======
import { appRouter, createContext, createNextApiHandler } from '@elevateart/api'
import { env } from '../../../env/server.mjs'
>>>>>>> app/turbo-repo

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
