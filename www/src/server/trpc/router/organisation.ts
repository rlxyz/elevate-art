import { AssetDeploymentBranch } from '@prisma/client'
import { TRPCError } from '@trpc/server'
import { OrganisationDatabaseRoleEnum } from 'src/shared/enums'
import { z } from 'zod'
import { protectedProcedure, publicProcedure, router } from '../trpc'

export const organisationRouter = router({
  findAll: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.organisation.findMany({
      where: { members: { some: { userId: ctx.session.user.id } } },
      include: {
        _count: { select: { repositories: true } },
        members: { include: { user: true } },
        pendings: { include: { organisation: true } },
      },
    })
  }),
  findAllRepository: protectedProcedure
    .input(
      z.object({
        organisationId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { organisationId } = input
      return await ctx.prisma.repository.findMany({
        where: { organisation: { id: organisationId } },
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
    }),
  findAllInvites: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.prisma.user.findUnique({
      where: {
        id: ctx.session.user.id,
      },
    })
    if (!user) return
    return await ctx.prisma.organisationPending.findMany({
      where: {
        address: user.address,
      },
      include: {
        organisation: true,
      },
    })
  }),
  sendInvite: protectedProcedure
    .input(
      z.object({
        organisationId: z.string(),
        address: z.string(),
        role: OrganisationDatabaseRoleEnum,
      })
    )
    .mutation(async ({ ctx, input }) => {
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
        include: {
          _count: { select: { repositories: true } },
          members: { include: { user: true } },
          pendings: { include: { organisation: true } },
        },
      })
    }),
  acceptInvite: protectedProcedure
    .input(
      z.object({
        pendingId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { pendingId } = input

      const pending = await ctx.prisma.organisationPending.findFirst({
        where: {
          id: pendingId,
        },
      })

      if (!pending) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Pending invite not found',
        })
      }

      const user = await ctx.prisma.user.findUnique({
        where: {
          address: pending?.address,
        },
      })

      if (!user) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'User not found',
        })
      }

      // @todo introduce and test this
      return await ctx.prisma.organisation.update({
        where: { id: pending.organisationId },
        data: {
          members: {
            create: {
              userId: user.id,
              type:
                pending.role === OrganisationDatabaseRoleEnum.enum.Admin
                  ? OrganisationDatabaseRoleEnum.enum.Admin
                  : OrganisationDatabaseRoleEnum.enum.Curator,
            },
          },
          pendings: {
            delete: {
              address_organisationId: {
                address: pending.address,
                organisationId: pending.organisationId,
              },
            },
          },
        },
        include: {
          _count: { select: { repositories: true } },
          members: { include: { user: true } },
          pendings: { include: { organisation: true } },
        },
      })
    }),
  findByName: publicProcedure
    .input(
      z.object({
        name: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { name } = input

      return await ctx.prisma.organisation.findFirst({
        where: {
          name,
        },
      })
    }),
  findAllRepositoryInProduction: publicProcedure
    .input(
      z.object({
        organisationName: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { organisationName } = input

      return await ctx.prisma.repository.findMany({
        where: {
          organisation: { name: organisationName },
          assetDeployments: { some: { branch: AssetDeploymentBranch.PRODUCTION } },
        },
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
    }),
})
