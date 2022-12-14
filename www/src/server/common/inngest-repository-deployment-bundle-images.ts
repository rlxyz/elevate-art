import type { Prisma } from '@prisma/client'
import { RepositoryDeploymentStatus } from '@prisma/client'
import { getTraitElementImage } from '@server/common/cld-get-image'
import { createFunction } from 'inngest'
import * as v from 'src/shared/compiler'
import { prisma } from '../db/client'
import { storage } from '../utils/gcp-storage'

const repositoryDeploymentFailedUpdate = async ({ deploymentId }: { deploymentId: string }) => {
  await prisma?.repositoryDeployment.update({
    where: { id: deploymentId },
    data: { status: RepositoryDeploymentStatus.FAILED },
  })
}

const repositoryDeploymentDeployedUpdate = async ({ deploymentId }: { deploymentId: string }) => {
  await prisma?.repositoryDeployment.update({
    where: { id: deploymentId },
    data: { status: RepositoryDeploymentStatus.DEPLOYED },
  })
}

/**
 * This function is used in conjuction with the creation of a new RepositoryDeployment.
 * It will fetch all TraitElement images from Cloudinary & upload to a folder in GCP Storage.
 *
 * We do this so that we can use the images in the RepositoryDeployment without having to
 * make a request to Cloudinary. And also, if user then changes the image in Cloudinary,
 * we can still use the old image associated to the RepositoryDeployment.
 *
 * Bucket Design
 * name: `elevate-<repositoryId>-assets`
 * image: `deployments/<deploymentId>/tokens/<tokenId>/image.png`
 * attributes: `deployments/<deploymentId>/tokens/<tokenId>/attributes.png`
 * layers: `layers/<layerElementId>/<traitElementId>.png`
 *
 * @todo save any failed fetches of TraitElements into a buffer to query later
 */
export default createFunction('repository-deployment/bundle-images', 'repository-deployment/images.create', async ({ event }) => {
  const layerElements = event.data.attributes as Prisma.JsonArray as v.Layer[]
  const { repositoryId, deploymentId } = event.data as { repositoryId: string; deploymentId: string }

  /**
   * Ensure Deployment Exists
   */
  const deployment = await prisma?.repositoryDeployment.findFirst({
    where: { id: deploymentId, repositoryId },
    select: { id: true },
  })
  if (!deployment) {
    await repositoryDeploymentFailedUpdate({ deploymentId })
    console.log("Deployment doesn't exist")
    throw new Error(`Deployment ${deploymentId} does not exist`)
  }

  /**
   * Ensure Bucket Exists
   */
  const bucket = await storage.bucket(`elevate-${repositoryId}-assets`).exists()
  if (!bucket[0]) {
    await repositoryDeploymentFailedUpdate({ deploymentId })
    console.log("Bucket doesn't exist")
    throw new Error(`Bucket does not exist`)
  }

  /** Move all images from Cloudinary to GCP Bucket */
  await Promise.all(
    layerElements.map(
      async ({ id: l, traits: traitElements }) =>
        await Promise.all(
          traitElements.map(async ({ id: t }) => {
            const response = await getTraitElementImage({ r: repositoryId, l, t })
            if (response.failed) throw new Error("Couldn't get image")
            const buffer = response.getValue()
            if (!buffer) throw new Error("Couldn't get buffer")
            console.log('buffer found', repositoryId, deploymentId, l, t)
            try {
              return await storage
                .bucket(`elevate-${repositoryId}-assets`)
                .file(`deployments/${deploymentId}/layers/${l}/${t}.png`)
                .save(Buffer.from(buffer), { contentType: 'image/png' })
            } catch (e) {
              console.error(e)
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
})
