import { AssetDeploymentBranch } from '@prisma/client'
import { prisma } from 'src/server/db/client'

export const getAssetDeploymentByProduction = async ({
  organisationName,
  repositoryName,
}: {
  organisationName: string
  repositoryName: string
}) => {
  return await prisma.assetDeployment.findFirst({
    where: {
      branch: AssetDeploymentBranch.PRODUCTION,
      repository: {
        name: repositoryName,
        organisation: {
          name: organisationName,
        },
      },
    },
    include: { repository: true, contractDeployment: true },
  })
}
