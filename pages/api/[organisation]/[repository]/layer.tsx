import { LayerElement, PrismaLayerElement } from '@utils/types'
import { convertPrismaLayers, createPrismaClient } from '@utils/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async (
  request: NextApiRequest,
  response: NextApiResponse<LayerElement[]>
) => {
  const prisma = createPrismaClient()
  const collectionId: string = request.query.id as string
  prisma.layerElement
    .findMany({
      where: { collectionId: collectionId },
      orderBy: { priority: 'asc' }, // guarantee correctness
      include: {
        traits: {
          orderBy: { weight: 'asc' },
        },
      },
    })
    .then((data: PrismaLayerElement) => {
      prisma.$disconnect()
      const layers: Layer[] = convertPrismaLayers(data)
      response.status(200).json(layers)
    })
    .catch((err) => {
      console.error(err)
      prisma.$disconnect()
      response.status(400)
    })
}
