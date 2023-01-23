import type { LayerElement, Prisma, PrismaClient } from '@prisma/client'

/**
 * This script can be used to query all the LayerElements in the database.
 */
export const getAllLayerElements = async ({
  prisma,
}: {
  prisma: PrismaClient<Prisma.PrismaClientOptions, never, Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined>
}): Promise<LayerElement[]> => {
  /* Start an transaction to ensure all runs at once. */
  return await prisma.layerElement.findMany()
}
