import { OrganisationDatabaseRoleEnum } from "src/types/enums";
import { z } from "zod";
import { createRouter } from "../context";

export const organisationRouter = createRouter()
  .query("getManyOrganisationByUserId", {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ ctx, input }) {
      return await ctx.prisma.organisation.findMany({
        where: {
          members: {
            some: {
              userId: input.id,
            },
          },
        },
        include: {
          _count: {
            select: {
              repositories: true,
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
      });
    },
  })
  .query("getManyPendingOrganisationByUserId", {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ input: { id }, ctx }) {
      const user = await ctx.prisma.user.findUnique({
        where: {
          id,
        },
      });
      if (!user) return;
      return await ctx.prisma.organisationPending.findMany({
        where: {
          address: user.address,
        },
        include: {
          organisation: true,
        },
      });
    },
  })

  .query("getManyRepositoryByOrganisationId", {
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
      });
    },
  })
  .mutation("addUser", {
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
      });
    },
  })
  .mutation("acceptInvitation", {
    input: z.object({
      pendingId: z.string(),
    }),
    async resolve({ input: { pendingId }, ctx }) {
      const pending = await ctx.prisma.organisationPending.findFirst({
        where: {
          id: pendingId,
        },
      });
      // should throw error
      if (!pending) return null;
      const user = await ctx.prisma.user.findUnique({
        where: {
          address: pending?.address,
        },
      });
      // should throw error
      if (!user) return null;

      // @todo introduce and test this
      // await ctx.prisma.organisation.update({
      //   where: { id: pending.organisationId },
      //   data: {
      //     members: {
      //       create: {
      //         userId: user.id,
      //         type:
      //           pending.role === OrganisationDatabaseRoleEnum.enum.Admin
      //             ? OrganisationDatabaseRoleEnum.enum.Admin
      //             : OrganisationDatabaseRoleEnum.enum.Curator,
      //       },
      //     },
      //     pendings: {
      //       delete: {
      //         address_organisationId: {
      //           address: pending.address,
      //           organisationId: pending.organisationId,
      //         },
      //       },
      //     },
      //   },
      // })

      await ctx.prisma.$transaction(async (tx) => {
        await tx.organisationPending.delete({ where: { id: pendingId } });
        await tx.organisation.update({
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
          },
        });
      });
    },
  });
