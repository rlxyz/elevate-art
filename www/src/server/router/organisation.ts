import { z } from 'zod'
import { createRouter } from './context'

export const organisationRouter = createRouter().query('getOrganisationByName', {
  input: z.object({
    name: z.string(),
  }),
  async resolve({ ctx, input }) {
    return await ctx.prisma.organisation.findFirst({
      where: {
        ...input,
      },
    })
  },
})
