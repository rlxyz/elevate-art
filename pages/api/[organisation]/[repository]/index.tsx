import {
  Organisation,
  PrismaOrganisation,
  PrismaRepository,
  Repository,
} from '@utils/types'
import { convertPrismaRepository, createPrismaClient } from '@utils/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async (
  request: NextApiRequest,
  response: NextApiResponse<Repository>
) => {
  const prisma = createPrismaClient()
  const organisationName: string = request.query.organisation as string
  const repositoryName: string = request.query.repository as string

  prisma.organisation
    .findFirst({
      where: {
        name: organisationName,
      },
      include: {
        repositories: {
          where: { name: repositoryName },
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
              orderBy: { updatedAt: 'asc' }, // get most recent updated organisation first
            },
          },
        },
      },
    })
    .then((data: PrismaOrganisation) => {
      prisma.$disconnect()
      const repositories = data.repositories as PrismaRepository[]
      const repository: Repository = convertPrismaRepository(repositories[0])
      return response.status(200).json(repository)
    })
    .catch((err) => {
      console.error(err)
      prisma.$disconnect()
      return response.status(400)
    })
}
