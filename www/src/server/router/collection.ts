import { z } from 'zod'
import { createRouter } from './context'

export const collectionRouter = createRouter()
  .mutation('incrementGeneration', {
    input: z.object({ id: z.string() }),
    async resolve({ ctx, input }) {
      return await ctx.prisma.collection.update({
        where: { id: input.id },
        data: { generations: { increment: 1 } },
      })
    },
  })
  .mutation('create', {
    input: z.object({
      organisationName: z.string(),
      repositoryName: z.string(),
      name: z.string(),
      totalSupply: z.number(),
    }),
    async resolve({ ctx, input }) {
      const repo = await ctx.prisma.repository.findFirst({
        where: {
          organisation: {
            name: input.organisationName,
          },
          name: input.repositoryName,
        },
      })

      if (!repo) throw new Error('Repository not found')

      return await ctx.prisma.collection.create({
        data: {
          name: input.name,
          repositoryId: repo.id,
          totalSupply: input.totalSupply,
        },
      })
    },
  })
  .query('getCollectionByName', {
    input: z.object({
      repositoryId: z.string(),
      name: z.string(),
    }),
    async resolve({ ctx, input }) {
      return ctx.prisma.collection.findFirst({
        where: {
          name: input.name,
        },
      })
    },
  })
  .query('getCollectionByRepositoryNameAndOrganisationName', {
    input: z.object({
      repositoryName: z.string(),
      organisationName: z.string(),
    }),
    async resolve({ ctx, input }) {
      return ctx.prisma.collection.findMany({
        where: {
          repository: {
            name: input.repositoryName,
            organisation: {
              name: input.organisationName,
            },
          },
        },
      })
    },
  })
  .query('getCollectionById', {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ ctx, input }) {
      return ctx.prisma.collection.findFirst({
        where: {
          ...input,
        },
      })
    },
  })
  .query('getCollectionByRepositoryId', {
    input: z.object({
      repositoryId: z.string(),
    }),
    async resolve({ ctx, input }) {
      return ctx.prisma.collection.findFirst({
        where: {
          repositoryId: input.repositoryId,
        },
      })
    },
  })
