import { OrganisationDatabaseRoleEnum } from 'src/types/enums'
import { z } from 'zod'
import { createRouter } from '../context'

export const organisationRouter = createRouter()
  .query('getManyPendingOrganisationByUserId', {
    input: z.object({
      address: z.string(),
    }),
    async resolve({ input: { address }, ctx }) {
      return await ctx.prisma.organisationPending.findMany({
        where: {
          address,
        },
        include: {
          organisation: true,
        },
      })
    },
  })
  .mutation('acceptInvitation', {
    input: z.object({
      organisationId: z.string(),
      address: z.string(),
    }),
    async resolve({ input: { organisationId, address }, ctx }) {
      const pending = await ctx.prisma.organisationPending.findUnique({
        where: {
          address_organisationId: {
            organisationId,
            address,
          },
        },
      })
      const user = await ctx.prisma.user.findUnique({
        where: {
          address,
        },
      })
      if (!pending || !user) return null
      console.log({ pending, user })
      await ctx.prisma.$transaction(async (tx) => {
        await tx.organisationPending.delete({
          where: {
            address_organisationId: {
              organisationId,
              address,
            },
          },
        })
        console.log('creating', pending.role, user.address)
        if (pending.role === OrganisationDatabaseRoleEnum.enum.Admin) {
          const a = await tx.organisation.update({
            where: {
              id: organisationId,
            },
            data: {
              admins: {
                create: {
                  userId: user.id,
                },
              },
            },
          })
        }
        if (pending.role === OrganisationDatabaseRoleEnum.enum.Member) {
          await tx.organisation.update({
            where: {
              id: organisationId,
            },
            data: {
              members: {
                create: {
                  userId: user.id,
                },
              },
            },
          })
        }
      })
    },
  })
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
          pendings: {
            include: {
              organisation: true,
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
