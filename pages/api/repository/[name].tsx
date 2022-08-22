import { convertPrismaRepository, createPrismaClient } from '@utils/prisma'
import { PrismaOrganisation, PrismaRepository, Repository } from '@utils/types'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async (
  request: NextApiRequest,
  response: NextApiResponse<Repository>
) => {
  const prisma = createPrismaClient()
  const name: string = request.query.name as string

  prisma.repository
    .findFirst({
      where: { name },
      include: {
        layers: {
          orderBy: { priority: 'asc' }, // guarantee layer order correctness
          include: {
            traitElements: {
              orderBy: { weight: 'asc' }, // guarantee rarest first
            },
          },
        },
        collections: {
          orderBy: { createdAt: 'asc' }, // get most recent updated organisation first
        },
      },
    })
    .then((data: PrismaRepository) => {
      prisma.$disconnect()
      return response.status(200).json(convertPrismaRepository(data))
    })
    .catch((err) => {
      console.error(err)
      prisma.$disconnect()
      return response.status(400)
    })
}
