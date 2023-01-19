import { AssetDeploymentStatus } from '@prisma/client'
import { updateManyByField } from '@server/utils/prisma-utils'
import type { NextApiRequest, NextApiResponse } from 'next'
import { env } from 'src/env/server.mjs'
import { prisma } from '../../../server/db/client'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { authorization } = req.headers

      if (authorization === `Bearer ${env.GH_API_SECRET_KEY}`) {
        const deployments = await prisma.assetDeployment.findMany({
          where: {
            OR: [
              {
                status: AssetDeploymentStatus.PENDING,
                updatedAt: {
                  lt: new Date(Date.now() - 5 * 60 * 1000),
                },
              },
            ],
          },
        })

        if (deployments.length === 0) {
          return res.status(200).json({ success: false, message: 'No deployments to cancel' })
        }

        await updateManyByField(prisma, 'AssetDeployment', 'status', deployments, (x) => [x.id, AssetDeploymentStatus.FAILED])

        res.status(200).json({ success: true })
      } else {
        res.status(401).json({ success: false })
      }
    } catch (err) {
      if (err instanceof Error) {
        res.status(500).json({ statusCode: 500, message: err.message })
      }

      res.status(500).json({ statusCode: 500, message: 'Internal Server Error' })
    }
  } else {
    res.setHeader('Allow', 'POST')
    res.status(405).end('Method Not Allowed')
  }
}
