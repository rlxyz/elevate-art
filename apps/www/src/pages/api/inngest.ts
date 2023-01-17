import repositoryDeploymentBundleImages from '@server/common/inngest-repository-deployment-bundle-images'
import { createIngestInstance } from '@server/utils/inngest'
import { serve } from 'inngest/next'
import { env } from 'src/env/server.mjs'

export default serve(createIngestInstance(), [repositoryDeploymentBundleImages], {
  signingKey: env.INNGEST_SIGNING_KEY,
})
