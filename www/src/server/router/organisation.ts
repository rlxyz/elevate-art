import { createRouter } from './context'
import { z } from 'zod'

export const getOrganisationByNameSchema = z.object({
  name: z.string(),
})

export const organisationRouter = createRouter().query('getOrganisationByName', {
  input: getOrganisationByNameSchema,
  async resolve({ ctx, input }) {
    return await ctx.prisma.organisation.findFirst({
      where: {
        ...input,
      },
    })
  },
})
