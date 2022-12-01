import { Prisma, PrismaClient, TraitElement } from "@elevateart/db";
import { groupBy } from "../utils/object-utils";

export type LayerElementObjectWithTraitElements = {
  [key: string]: TraitElement[];
};

/**
 * This function returns all the LayerElements based on a list of TraitElements with unordered LayerElements
 * It sorts the list ascendingly by weight.
 *
 * @todo turn qstash fetch typesafe and error handle
 */
export const getLayerElementsWithTraitElements = async ({
  layerElementIds,
  prisma,
}: {
  layerElementIds: string[];
  prisma: PrismaClient<
    Prisma.PrismaClientOptions,
    never,
    Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined
  >;
}): Promise<LayerElementObjectWithTraitElements> => {
  return groupBy(
    await prisma.traitElement.findMany({
      where: {
        layerElementId: { in: layerElementIds },
      },
      orderBy: { weight: "desc" },
    }),
    (x) => x.layerElementId,
  );
};
