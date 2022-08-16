import { PrismaTraitElement, TraitElement } from '@utils/types'
import { convertPrismaTraitElement, createPrismaClient } from '@utils/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'

type Response =
  | {
      success: boolean
    }
  | TraitElement

export default async (
  request: NextApiRequest,
  response: NextApiResponse<Response>
) => {
  const prisma = createPrismaClient()
  const id: string = request.query.id as string

  switch (request.method) {
    case 'GET':
      prisma.traitElement
        .findFirst({
          where: { id },
        })
        .then((data: PrismaTraitElement) => {
          prisma.$disconnect()
          return response.status(200).json(convertPrismaTraitElement(data))
        })
        .catch((err) => {
          console.error(err)
          prisma.$disconnect()
          return response.status(400)
        })
      break
    case 'POST':
      const weight: number = Number(request.body.weight as number)
      console.log('updating', weight)
      prisma.traitElement
        .update({
          where: { id },
          data: { weight },
        })
        .then((data: PrismaTraitElement) => {
          prisma.$disconnect()
          console.log(data)
          return response.status(200).json({
            success: true,
          })
        })
        .catch((err) => {
          console.error(err)
          prisma.$disconnect()
          return response.status(400)
        })
      break
  }
}
