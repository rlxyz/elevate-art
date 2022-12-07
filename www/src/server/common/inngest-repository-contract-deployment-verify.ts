import { RepositoryDeploymentStatus } from '@prisma/client'
import { createStepFunction } from 'inngest'

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
export default createStepFunction(
  'repository-contract-deployment/create-deployment',
  'repository-contract-deployment/contract.verify',
  async ({ event, tools }) => {
    const contractAddress = event.data.contractAddress as string

    return { success: true }
  }
)
