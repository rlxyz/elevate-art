import {
  convertPrismaOrganisation,
  convertPrismaRepository,
  createPrismaClient,
} from '@utils/prisma'
import {
  Organisation,
  PrismaOrganisation,
  PrismaRepository,
  Repository,
} from '@utils/types'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async (
  request: NextApiRequest,
  response: NextApiResponse<Organisation>
) => {
  const prisma = createPrismaClient()
  const name: string = request.query.name as string
  prisma.organisation
    .findFirst({
      where: { name },
    })
    .then((data: PrismaOrganisation) => {
      prisma.$disconnect()
      return response.status(200).json(convertPrismaOrganisation(data))
    })
    .catch((err) => {
      console.error(err)
      prisma.$disconnect()
      return response.status(400)
    })
}
