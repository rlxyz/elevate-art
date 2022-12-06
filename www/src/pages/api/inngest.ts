import { serve } from 'inngest/next'
import repositoryDeploymentBundleImages from 'inngest/repository-deployment-bundle-images'
import { env } from 'src/env/server.mjs'
import { inngest } from '../../server/utils/inngest'

export default serve(inngest, [repositoryDeploymentBundleImages], {
  signingKey: env.INNGEST_SIGNING_KEY,
})
