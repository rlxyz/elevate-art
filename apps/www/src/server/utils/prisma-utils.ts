import type { Prisma, PrismaClient } from '@prisma/client'

const BATCH_CHUNK_SIZE = 100

/**
 * An extremely efficient updateMany, but only works for single field change
 *
 * Source: https://github.com/prisma/prisma/issues/2868#issuecomment-1263865062
 * Usage: await updateManyByField(ctx.prisma, 'TraitElement', 'weight', traitElements, (x) => [x.traitElementId, x.weight])
 */
export const updateManyByField = async <T>(
  prisma:
    | PrismaClient<Prisma.PrismaClientOptions, never, Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined>
    | Prisma.TransactionClient,
  model: Prisma.ModelName,
  field: string,
  array: T[],
  predicate: (value: T, index: number, array: T[]) => [string, any]
) => {
  for (const chunk of Array.from({ length: Math.ceil(array.length / BATCH_CHUNK_SIZE) }, (_, index) =>
    array.slice(index * BATCH_CHUNK_SIZE, (index + 1) * BATCH_CHUNK_SIZE)
  )) {
    const values: [string, any][] = chunk.flatMap((record, index) => predicate(record, index, array))
    return await prisma.$executeRawUnsafe(
      `UPDATE ${model} SET ${field} = CASE ${chunk.map(() => `WHEN id = ? THEN ?`).join('\n')} ELSE ${field} END;`,
      ...values
    )
  }
}
