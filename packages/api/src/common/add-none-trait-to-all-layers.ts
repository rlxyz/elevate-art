import { LayerElement, prisma } from "@elevateart/db";
import chalk from "chalk";

const log = console.log;

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
      log(chalk.blue("Starting transaction!"));

      /** Fetch all LayerElements */
      const layerElements: LayerElement[] = await tx.layerElement.findMany();
      log(
        chalk.green("Found") +
          " " +
          chalk.underline.yellow(layerElements.length) +
          " " +
          chalk.green("LayerElements"),
      );

      /** Create many TraitElements in one go. */
      log(chalk.blue("Creating None layers"));
      await tx.traitElement.createMany({
        data: layerElements.map((layerElement) => ({
          layerElementId: layerElement.id,
          name: "None",
          weight: 0,
          // readonly: true,
        })),
      });
      log(chalk.green("Successfuly added the TraitElements!"));
    });
  } catch (e) {
    console.error(e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
};

main();

export default main;
