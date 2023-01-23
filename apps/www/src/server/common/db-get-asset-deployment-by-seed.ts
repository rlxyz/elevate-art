import type { AssetDeploymentBranch } from '@prisma/client'
import { prisma } from 'src/server/db/client'

export const getAssetDeploymentBySeed = async ({
  branch,
  organisationName,
  repositoryName,
  seed,
}: {
  branch: AssetDeploymentBranch
  organisationName: string
  repositoryName: string
  seed: string
}) => {
  return await prisma.assetDeployment.findFirst({
    where: {
      branch,
      repository: {
        name: repositoryName,
        organisation: {
          name: organisationName,
        },
      },
      name: seed,
    },
    include: { repository: true, contractDeployment: true },
  })
}
