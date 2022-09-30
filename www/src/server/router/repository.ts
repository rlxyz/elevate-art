import { z } from 'zod'
import { createRouter } from './context'

export const repositoryRouter = createRouter()
  .query('getRepositoryByName', {
    input: z.object({
      name: z.string(),
    }),
    async resolve({ ctx, input }) {
      return await ctx.prisma.repository.findFirst({
        where: { ...input },
      })
    },
  })
  .query('getRepositoryLayers', {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ ctx, input }) {
      return await ctx.prisma.layerElement.findMany({
        where: {
          repositoryId: input.id,
        },
        orderBy: { priority: 'asc' },
        include: {
          traitElements: {
            orderBy: { weight: 'asc' }, // guarantee rarest first
            include: {
              rulesPrimary: {
                include: {
                  primaryTraitElement: {
                    include: {
                      layerElement: true,
                    },
                  },
                  secondaryTraitElement: {
                    include: {
                      layerElement: true,
                    },
                  },
                },
              },
              rulesSecondary: {
                include: {
                  primaryTraitElement: {
                    include: {
                      layerElement: true,
                    },
                  },
                  secondaryTraitElement: {
                    include: {
                      layerElement: true,
                    },
                  },
                },
              },
            },
          },
        },
      })
    },
  })
  .query('getRepositoryCollections', {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ ctx, input }) {
      return await ctx.prisma.collection.findMany({
        where: {
          repositoryId: input.id,
        },
        orderBy: { createdAt: 'asc' },
      })
    },
  })
  .query('getAllRepositoriesByOrganisationName', {
    input: z.object({
      name: z.string(),
    }),
    async resolve({ ctx, input }) {
      return await ctx.prisma.repository.findMany({
        where: { organisation: { name: input.name } },
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
  .query('getRepositoryById', {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ ctx, input }) {
      return await ctx.prisma.repository.findFirst({
        where: {
          ...input,
        },
      })
    },
  })
  .mutation('create', {
    input: z.object({
      name: z.string(),
      organisationId: z.string(),
    }),
    async resolve({ ctx, input }) {
      const repository = await ctx.prisma.repository.create({
        data: {
          name: input.name,
          tokenName: input.name,
          organisationId: input.organisationId,
        },
      })
      await ctx.prisma.collection.create({
        data: {
          name: 'main',
          repositoryId: repository.id,
          totalSupply: 10000,
        },
      })
      return repository
    },
  })
  .mutation('delete', {
    input: z.object({
      repositoryId: z.string(),
    }),
    async resolve({ ctx, input }) {
      await ctx.prisma.repository.delete({
        where: {
          id: input.repositoryId,
        },
      })
    },
  })
  .mutation('updateLayer', {
    input: z.object({
      layerId: z.string(),
      repositoryId: z.string(),
      traits: z.array(
        z.object({
          id: z.string(),
          weight: z.number(),
        })
      ),
    }),
    async resolve({ ctx, input }) {
      return Promise.all(
        input.traits.map(async ({ id, weight }) => {
          return await ctx.prisma.traitElement.update({
            where: {
              id,
            },
            data: {
              weight,
            },
          })
        })
      )
    },
  })
  .mutation('createRule', {
    input: z.object({
      type: z.string(),
      primaryLayerElementId: z.string(),
      primaryTraitElementId: z.string(),
      secondaryLayerElementId: z.string(),
      secondaryTraitElementId: z.string(),
      repositoryId: z.string(),
    }),
    async resolve({ ctx, input }) {
      await ctx.prisma.rules.create({
        data: {
          condition: input.type,
          primaryTraitElementId: input.primaryTraitElementId,
          secondaryTraitElementId: input.secondaryTraitElementId,
        },
      })
    },
  })
