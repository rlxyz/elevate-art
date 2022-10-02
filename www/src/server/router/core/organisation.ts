import { z } from 'zod'
import { createRouter } from '../context'

export const organisationRouter = createRouter()
  .query('getManyOrganisationByUserId', {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ ctx, input }) {
      return await ctx.prisma.organisation.findMany({
        where: {
          admins: {
            some: {
              userId: input.id,
            },
          },
        },
      })
    },
  })
  .query('getManyRepositoryByOrganisationId', {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ ctx, input }) {
      return await ctx.prisma.repository.findMany({
        where: { organisation: { id: input.id } },
        include: {
          _count: {
            select: { layers: true, collections: true },
          },
          layers: {
            include: {
              _count: {
                select: { traitElements: true },
              },
            },
          },
        },
      })
    },
  })
