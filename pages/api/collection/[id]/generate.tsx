import { convertPrismaCollection, createPrismaClient } from '@utils/prisma'
import { Collection, PrismaCollection } from '@utils/types'
import type { NextApiRequest, NextApiResponse } from 'next'

type Response = Collection

export default async (
  request: NextApiRequest,
  response: NextApiResponse<Response>
) => {
  const prisma = createPrismaClient()
  const id: string = request.query.id as string
  switch (request.method) {
    case 'GET':
      try {
        const data: PrismaCollection = await prisma.collection.findFirst({
          where: { id },
        })
        return response.status(200).json(convertPrismaCollection(data))
      } catch (err) {
        return response.status(400)
      }
    case 'POST':
      try {
        const data: PrismaCollection = await prisma.collection.update({
          where: { id },
          data: { generations: { increment: 1 } },
        })
        return response.status(200).json(convertPrismaCollection(data))
      } catch (err) {
        return response.status(400)
      }
  }
}
