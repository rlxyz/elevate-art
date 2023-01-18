import type { AssetDeploymentBranch, AssetDeploymentType, Prisma } from '@prisma/client'
import { Inngest } from 'inngest'
import { env } from 'src/env/server.mjs'

export type BundleImagesData = {
  repositoryId: string
  deploymentId: string
  layerElements: Prisma.JsonArray
  branch: AssetDeploymentBranch
  type: AssetDeploymentType
}

export type InngestEvents = {
  'repository-deployment/bundle-images': {
    name: 'repository-deployment/images.create'
    data: BundleImagesData
  }
}

export const createIngestInstance = () => {
  return new Inngest<InngestEvents>({
    name: env.NEXT_PUBLIC_APP_NAME,
    eventKey: env.INNGEST_EVENT_KEY,
  })
}
