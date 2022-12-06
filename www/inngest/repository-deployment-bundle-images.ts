import { Prisma, RepositoryDeploymentStatus } from '@prisma/client'
import { getTraitElementImage } from '@server/common/cld-get-image'
import { createFunction } from 'inngest'
import { env } from 'src/env/server.mjs'
import * as v from 'src/shared/compiler'
import { storage } from '../src/server/utils/gcp-storage'

export default createFunction('repository-deployment/bundle-images', 'repository-deployment/images.create', async ({ event }) => {
  const layerElements = event.data.attributes as Prisma.JsonArray as v.Layer[]
  const { repositoryId, deploymentId } = event.data as { repositoryId: string; deploymentId: string }

  await Promise.all(
    layerElements.map(
      async ({ id: l, traits: traitElements }) =>
        await Promise.all(
          traitElements.map(async ({ id: t }) => {
            const response = await getTraitElementImage({ r: repositoryId, l, t })
            if (response.failed) throw new Error("Couldn't get image")
            const blob = response.getValue()
            if (!blob) throw new Error("Couldn't get blob")
            console.log('blob found', repositoryId, deploymentId, l, t)
            try {
              return await storage
                .bucket(env.GCP_BUCKET_NAME)
                .file(`deployments/${repositoryId}/${deploymentId}/${l}/${t}.png`)
                .save(Buffer.from(await blob.arrayBuffer()))
            } catch (e) {
              console.error(e)
              throw new Error(`Couldn't save image: ${e}`)
            }
          })
        )
    )
  )
    .then(async () => {
      console.log('done deployment')
      await prisma?.repositoryDeployment.update({
        where: { id: deploymentId },
        data: { status: RepositoryDeploymentStatus.DEPLOYED },
      })
    })
    .catch(async () => {
      console.log('failed deployment')
      await prisma?.repositoryDeployment.update({
        where: { id: deploymentId },
        data: { status: RepositoryDeploymentStatus.FAILED },
      })
    })

  return { success: true }
})
