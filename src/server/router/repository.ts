import { createRouter } from './context'
import { z } from 'zod'

export const getRepositoryByNameSchema = z.object({
  name: z.string(),
})

export const repositoryRouter = createRouter().query('getRepositoryByName', {
  input: getRepositoryByNameSchema,
  async resolve({ ctx, input }) {
    return await ctx.prisma.repository.findFirst({
      where: {
        ...input,
      },
      include: {
        layers: {
          orderBy: { priority: 'asc' }, // guarantee layer order correctness
          include: {
            traitElements: {
              orderBy: { weight: 'asc' }, // guarantee rarest first
              include: {
                rulesPrimary: true,
                rulesSecondary: true,
              },
            },
          },
        },
        collections: {
          orderBy: { createdAt: 'asc' }, // get most recent updated organisation first
        },
      },
    })
  },
})
