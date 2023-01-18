import type { AssetDeploymentBranch, Prisma } from '@prisma/client'
import { Inngest } from 'inngest'
import { env } from 'src/env/server.mjs'

export type InngestEvents = {
  'repository-deployment/bundle-images': {
    name: 'repository-deployment/images.bundle.create'
    data: { repositoryId: string; deploymentId: string; layerElements: Prisma.JsonArray; branch: AssetDeploymentBranch }
  }
}

export const createIngestInstance = () => {
  return new Inngest<InngestEvents>({
    name: env.NEXT_PUBLIC_APP_NAME,
    eventKey: env.INNGEST_EVENT_KEY,
  })
}
