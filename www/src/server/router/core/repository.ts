import { z } from 'zod'
import { createRouter } from '../context'

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
  .mutation('create', {
    input: z.object({
      organisationId: z.string(),
      name: z.string(),
      layerElements: z.array(z.object({ name: z.string(), traitElements: z.array(z.object({ name: z.string() })) })),
    }),
    async resolve({ ctx, input }) {
      const { name, organisationId, layerElements } = input
      await ctx.prisma.repository.create({
        data: {
          organisationId,
          name,
          tokenName: name,
          collections: {
            create: {
              name: 'main',
              totalSupply: 10000,
              type: 'default', // when collection created, it is default branch
            },
          },
          layers: {
            create: layerElements.map(({ name, traitElements }, index) => ({
              name,
              priority: index,
              traits: {
                create: traitElements.map(({ name }) => ({
                  name,
                  weight: 1,
                })),
              },
            })),
          },
        },
      })
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
  // todo: refactor to use transactions
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
  // todo: better naming conventions?
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
