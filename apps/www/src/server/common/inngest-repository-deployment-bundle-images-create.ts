import type { Prisma } from '@prisma/client'
import { AssetDeploymentStatus } from '@prisma/client'
import type { InngestEvents } from '@server/utils/inngest'
import { createFunction } from 'inngest'
import type * as v from 'src/shared/compiler'
import { prisma } from '../db/client'
import { fetchAndSaveAllTraitElementsToGCP } from './gcp-save-cld-trait-element'

const repositoryDeploymentFailedUpdate = async ({ deploymentId }: { deploymentId: string }) => {
  await prisma?.assetDeployment.update({
    where: { id: deploymentId },
    data: { status: AssetDeploymentStatus.FAILED },
  })
}

const repositoryDeploymentDeployedUpdate = async ({ deploymentId }: { deploymentId: string }) => {
  await prisma?.assetDeployment.update({
    where: { id: deploymentId },
    data: { status: AssetDeploymentStatus.DEPLOYED },
  })
}

/**
 * This function is used in conjuction with the creation of a new AssetDeployment.
 * It will fetch all TraitElement images from Cloudinary & upload to a folder in GCP Storage.
 *
 * We do this so that we can use the images in the AssetDeployment without having to
 * make a request to Cloudinary. And also, if user then changes the image in Cloudinary,
 * we can still use the old image associated to the AssetDeployment.
 *
 * @todo save any failed fetches of TraitElements into a buffer to query later
 *! @todo when the bucket is created, auto set it to public... then we can serve content directly from bucket
 */
export default createFunction<InngestEvents['repository-deployment/bundle-images']>(
  'repository-deployment/bundle-images',
  'repository-deployment/images.bundle.create',
  async ({ event }) => {
    const layerElements = event.data.layerElements as Prisma.JsonArray as v.Layer[]
    const { repositoryId, deploymentId, branch, type } = event.data

    if (!layerElements || !repositoryId || !deploymentId || !branch) {
      return { status: 400 }
    }

    try {
      /**
       * Ensure Deployment Exists
       * @todo better error handling here...
       */
      const deployment = await prisma?.assetDeployment.findFirst({
        where: { id: deploymentId, repositoryId },
        select: { id: true },
      })
      if (!deployment) {
        await repositoryDeploymentFailedUpdate({ deploymentId })
        return { status: 400 }
      }

      /**
       * Create Promises
       */
      const all = fetchAndSaveAllTraitElementsToGCP({ layerElements, repositoryId, deploymentId })

      /** Move all images from Cloudinary to GCP Bucket */
      await Promise.allSettled(all)
        .then(async () => {
          await repositoryDeploymentDeployedUpdate({ deploymentId })
          return { status: 200 }
        })
        .catch(async () => {
          await repositoryDeploymentFailedUpdate({ deploymentId })
          return { status: 400 }
        })
    } catch (e) {
      console.error(e)
      await repositoryDeploymentFailedUpdate({ deploymentId })
      return { status: 400 }
    }
  }
)
