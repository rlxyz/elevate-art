import { PrismaUser, User } from '@utils/types'
import { convertPrismaUser, createPrismaClient } from '@utils/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'
import { getEthereumAddress } from '@utils/ens'

export default async (
  request: NextApiRequest,
  response: NextApiResponse<User>
) => {
  const prisma = createPrismaClient()
  const address: string = await getEthereumAddress(
    request.query.address as string
  )

  if (!address || address === null) {
    return response.status(400)
  }

  prisma.user
    .findFirst({
      where: { address },
      include: {
        organisations: {
          orderBy: { updatedAt: 'asc' }, // get most recent updated organisation first
          include: {
            repositories: {
              orderBy: { updatedAt: 'asc' }, // get most recent updated organisation first
              include: {
                layers: {
                  orderBy: { priority: 'asc' }, // guarantee layer order correctness
                  include: {
                    traits: {
                      orderBy: { weight: 'asc' }, // guarantee rarest first
                    },
                  },
                },
                collections: {
                  orderBy: { updatedAt: 'asc' }, // get most recent updated organisation first
                },
              },
            },
          },
        },
      },
    })
    .then((data: PrismaUser) => {
      prisma.$disconnect()
      const user: User = convertPrismaUser(data)
      return response.status(200).json(user)
    })
    .catch((err) => {
      prisma.$disconnect()
      console.error(err)
      return response.status(400)
    })

  return response.status(400)
}
