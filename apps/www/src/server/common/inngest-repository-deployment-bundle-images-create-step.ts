import type { Prisma } from '@prisma/client'
import { AssetDeploymentStatus } from '@prisma/client'
import type { InngestEvents } from '@server/utils/inngest'
import { createStepFunction } from 'inngest'
import type * as v from 'src/shared/compiler'
import { prisma } from '../db/client'
import { fetchAndSaveAllTraitElementsToGCP } from './cld-to-gcp-save-trait-element'

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
export default createStepFunction<InngestEvents['repository-deployment/bundle-images']>(
  'repository-deployment/bundle-images',
  'repository-deployment/images.bundle.create',
  async ({ event, tools }) => {
    const layerElements = event.data.layerElements as Prisma.JsonArray as v.Layer[]
    const { repositoryId, deploymentId, branch, type } = event.data

    if (!layerElements || !repositoryId || !deploymentId || !branch) {
      return { status: 400 }
    }

    /**
     * Ensure Deployment Exists
     * @todo better error handling here...
     */
    try {
      const deployment = await prisma?.assetDeployment.findFirst({
        where: { id: deploymentId, repositoryId },
        select: { id: true },
      })
      if (!deployment) {
        await repositoryDeploymentFailedUpdate({ deploymentId })
        return { status: 400 }
      }

      //! Ensure Bucket Exists; removed due to GCP service account not having permission to list buckets
      // const [bucket] = await getAssetDeploymentBucket({ branch }).exists()
      // if (!bucket) {
      //   await repositoryDeploymentFailedUpdate({ deploymentId })
      //   return { status: 400 }
      // }

      /**
       * Create Promises
       */
      layerElements.map((item) => {
        tools.run('repository-deployment/bundle-images-layer', () => {
          fetchAndSaveAllTraitElementsToGCP({ layerElements: [item], repositoryId, deploymentId, branch })
        })
      })

      const all = fetchAndSaveAllTraitElementsToGCP({ layerElements, repositoryId, deploymentId, branch })

      /** Move all images from Cloudinary to GCP Bucket */
      Promise.allSettled(all)
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
