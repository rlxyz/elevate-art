<<<<<<< HEAD:apps/www/src/pages/api/trpc/[trpc].ts
// src/pages/api/trpc/[trpc].ts
import { appRouter, createContext, createNextApiHandler } from '@elevateart/api'
import { env } from '../../../env/server.mjs'
=======
import { createNextApiHandler } from '@trpc/server/adapters/next'

import { env } from '../../../env/server.mjs'
import { createContext } from '../../../server/trpc/context'
import { appRouter } from '../../../server/trpc/router/_app'
>>>>>>> staging:www/src/pages/api/trpc/[trpc].ts

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
