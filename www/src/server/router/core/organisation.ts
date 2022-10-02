import { OrganisationDatabaseRoleEnum } from 'src/types/enums'
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
        include: {
          admins: {
            include: {
              user: true,
            },
          },
          members: {
            include: {
              user: true,
            },
          },
          pendings: true,
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
  .mutation('addUser', {
    input: z.object({
      organisationId: z.string(),
      address: z.string(),
      role: OrganisationDatabaseRoleEnum,
    }),
    async resolve({ ctx, input }) {
      return await ctx.prisma.organisation.update({
        where: { id: input.organisationId },
        data: {
          pendings: {
            create: {
              address: input.address,
              role: input.role,
            },
          },
        },
      })
    },
  })
