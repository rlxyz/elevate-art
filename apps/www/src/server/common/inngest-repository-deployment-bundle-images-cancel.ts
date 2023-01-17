import { AssetDeploymentStatus } from '@prisma/client'
import { updateManyByField } from '@server/utils/prisma-utils'
import { createScheduledFunction } from 'inngest'
import { prisma } from '../db/client'

export default createScheduledFunction('repository-deployment/images.bundle.create', '*/5 * * * *', async () => {
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
    return { status: 200 }
  }

  await updateManyByField(prisma, 'AssetDeployment', 'status', deployments, (x) => [x.id, AssetDeploymentStatus.FAILED])

  return { status: 200 }
})
