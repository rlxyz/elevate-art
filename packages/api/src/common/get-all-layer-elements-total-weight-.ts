import { Prisma, PrismaClient } from "@elevateart/db";

/**
 * This function returns total weightage of the TraitElements based on weight
 */
export const getLayerElementsWithTraitElementsTotalWeight = async ({
  prisma,
}: {
  prisma: PrismaClient<
    Prisma.PrismaClientOptions,
    never,
    Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined
  >;
}) => {
  return await prisma.traitElement.groupBy({
    by: ["layerElementId"],
    _sum: {
      weight: true,
    },
  });
};
