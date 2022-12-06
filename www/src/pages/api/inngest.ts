import { createIngestInstance } from '@server/utils/inngest'
import { serve } from 'inngest/next'
import repositoryDeploymentBundleImages from 'inngest/repository-deployment-bundle-images'
import { env } from 'src/env/server.mjs'

export default serve(createIngestInstance(), [repositoryDeploymentBundleImages], {
  signingKey: env.INNGEST_SIGNING_KEY,
})
