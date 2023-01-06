import type { AssetDeploymentBranch, AssetDeploymentType, Prisma } from '@prisma/client'
import { AssetDeploymentStatus } from '@prisma/client'
import { getTraitElementImage } from '@server/common/cld-get-image'
import type { InngestEvents } from '@server/utils/inngest'
import { createFunction } from 'inngest'
import type * as v from 'src/shared/compiler'
import { prisma } from '../db/client'
import { getAssetDeploymentBucket } from '../utils/gcp-storage'

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
  'repository-deployment/images.create',
  async ({ event }) => {
    const layerElements = event.data.layerElements as Prisma.JsonArray as v.Layer[]
    const { repositoryId, deploymentId, branch, type } = event.data as {
      repositoryId: string
      deploymentId: string
      branch: AssetDeploymentBranch
      type: AssetDeploymentType
    }

    if (!repositoryId || !deploymentId || !layerElements) {
      await repositoryDeploymentFailedUpdate({ deploymentId })
      throw new Error('Missing required data')
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
        console.log("Deployment doesn't exist")
        throw new Error(`Deployment ${deploymentId} does not exist`)
      }
    } catch (e) {
      console.log('deployment error', e)
      await repositoryDeploymentFailedUpdate({ deploymentId })
      throw new Error(`Deployment ${deploymentId} does not exist`)
    }

    /**
     * Ensure Bucket Exists
     *! @todo should also handle AssetDeploymentBranch.PRODUCTION
     */
    const bucket = await getAssetDeploymentBucket({ branch }).exists()

    if (!bucket[0]) {
      await repositoryDeploymentFailedUpdate({ deploymentId })
      console.log("Bucket doesn't exist")
      throw new Error(`Bucket does not exist`)
    }

    /** Move all images from Cloudinary to GCP Bucket */
    Promise.allSettled(
      layerElements.map(async ({ id: l, traits: traitElements }) =>
        Promise.allSettled(
          traitElements.map(async ({ id: t }) => {
            const response = await getTraitElementImage({ r: repositoryId, l, t })
            if (response.failed) throw new Error("Couldn't get image")
            const buffer = response.getValue()
            if (!buffer) throw new Error("Couldn't get buffer")
            try {
              //! @todo abstract all this functionality into own file
              console.log('saving', { r: repositoryId, l, t })
              return await getAssetDeploymentBucket({ branch })
                .file(`${repositoryId}/deployments/${deploymentId}/layers/${l}/${t}.png`)
                .save(Buffer.from(buffer), { contentType: 'image/png' })
            } catch (e) {
              console.error('some-random-error', e)
              throw new Error(`Couldn't save image: ${e}`)
            }
          })
        )
      )
    )
      .then(async () => {
        console.log('done deployment')
        await repositoryDeploymentDeployedUpdate({ deploymentId })
      })
      .catch(async () => {
        console.log('failed deployment')
        await repositoryDeploymentFailedUpdate({ deploymentId })
      })

    return { success: true }
  }
)
