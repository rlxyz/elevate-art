import type { LayerElement } from '@prisma/client'
import { PrismaClient } from '@prisma/client'
import chalk from 'chalk'

const prisma = new PrismaClient()

/**
 * This script adds a new None trait to every existing LayerElement
 * This should never be ran again! This trait can only be added once.
 *
 * @todo add readonly?
 * @todo rework
 */
export const main = async () => {
  try {
    /* Start an transaction to ensure all runs at once. */
    await prisma.$transaction(async (tx) => {
      console.log(chalk.blue('Starting transaction!'))

      /** Fetch all LayerElements */
      const layerElements: LayerElement[] = await tx.layerElement.findMany()
      console.log(chalk.green('Found') + ' ' + chalk.underline.yellow(layerElements.length) + ' ' + chalk.green('LayerElements'))

      /** Create many TraitElements in one go. */
      console.log(chalk.blue('Creating None layers'))
      await tx.traitElement.createMany({
        data: layerElements.map((layerElement) => ({
          layerElementId: layerElement.id,
          name: 'None',
          weight: 0,
          // readonly: true,
        })),
      })
      console.log(chalk.green('Successfuly added the TraitElements!'))
    })
  } catch (e) {
    console.error(e)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()

export default main
