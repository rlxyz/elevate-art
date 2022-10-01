import { z } from 'zod'
import { createRouter } from '../context'

export const organisationRouter = createRouter().query('getManyOrganisationByUserId', {
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
