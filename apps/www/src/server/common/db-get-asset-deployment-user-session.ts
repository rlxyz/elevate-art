import type { Session } from 'next-auth'

export const validateUserIsMemberInAssetDeployment = async ({
  chainId,
  address,
  session,
}: {
  chainId: number
  address: string
  session: Session
}) => {
  return await prisma?.assetDeployment.findFirst({
    where: {
      contractDeployment: {
        chainId,
        address,
      },
      repository: {
        organisation: {
          members: {
            some: {
              id: session.user?.id,
            },
          },
        },
      },
    },
  })
}
