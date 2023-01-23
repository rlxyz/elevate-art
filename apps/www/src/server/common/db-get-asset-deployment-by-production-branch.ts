import { prisma } from 'src/server/db/client'

export const getAssetDeploymentByContractAddressAndChainId = async ({ chainId, address }: { chainId: number; address: string }) => {
  return await prisma.assetDeployment.findFirst({
    where: {
      contractDeployment: {
        chainId,
        address,
      },
    },
    include: { repository: true, contractDeployment: true },
  })
}
