import { Prisma, RepositoryDeploymentStatus } from '@prisma/client'
import { storage } from '@server/utils/gcp-storage'
import { createIngestInstance } from '@server/utils/inngest'
import { TRPCError } from '@trpc/server'
import Big from 'big.js'
import * as v from 'src/shared/compiler'
import { z } from 'zod'
import { protectedProcedure, router } from '../trpc'

/**
 * Repository Router
 * Any Repository functionality should implemented here.
 *
 * @todo protect this router by checking if the user is the owner of the repository
 */
export const repositoryRouter = router({
  findByName: protectedProcedure
    .input(
      z.object({
        name: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { name } = input
      return await ctx.prisma.repository.findFirst({ where: { name } })
    }),
  create: protectedProcedure
    .input(
      z.object({
        organisationId: z.string(),
        name: z.string(),
        layerElements: z.array(z.object({ name: z.string(), traitElements: z.array(z.object({ name: z.string() })) })),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { name, organisationId, layerElements } = input
      return await ctx.prisma.repository.create({
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
              traitElements: {
                createMany: {
                  data: traitElements.map(({ name }) => ({ name, weight: Big(1).div(traitElements.length).mul(100).toNumber() })),
                },
              },
            })),
          },
        },
        include: {
          collections: true,
          layers: {
            include: {
              traitElements: true,
            },
          },
        },
      })
    }),
  findDeployments: protectedProcedure
    .input(
      z.object({
        repositoryId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { repositoryId } = input
      return await ctx.prisma.repositoryDeployment.findMany({
        where: { repositoryId: repositoryId },
        orderBy: { createdAt: 'desc' },
        include: { contractDeployment: true },
      })
    }),
  createBucket: protectedProcedure
    .input(
      z.object({
        repositoryId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { repositoryId } = input
      await storage.createBucket(`elevate-${repositoryId}-assets`)
      await ctx.prisma.repository.update({ where: { id: repositoryId }, data: { bucket: true } })
    }),
  createDeployment: protectedProcedure
    .input(
      z.object({
        repositoryId: z.string(),
        collectionId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { repositoryId, collectionId } = input

      const repository = await ctx.prisma.repository.findFirst({
        where: { id: repositoryId },
        include: {
          collections: { where: { id: collectionId } },
          layers: {
            include: {
              traitElements: {
                include: {
                  rulesPrimary: true,
                  rulesSecondary: true,
                },
              },
            },
          },
        },
      })

      if (!repository) {
        throw new TRPCError({ code: 'NOT_FOUND' })
      }

      const { layers: layerElements, collections } = repository

      const collection = collections[0]

      if (!collection) {
        throw new TRPCError({ code: 'NOT_FOUND' })
      }

      const deployment = await ctx.prisma.repositoryDeployment.create({
        data: {
          userId: ctx.session.user.id,
          repositoryId,
          collectionName: collection.name,
          collectionGenerations: collection.generations,
          collectionTotalSupply: collection.totalSupply || 1,
          status: RepositoryDeploymentStatus.PENDING,
          name: (Math.random() + 1).toString(36).substring(4),
          attributes: layerElements.map(({ id, name, priority, traitElements }) => ({
            id,
            name,
            priority,
            traits: traitElements.map(({ id, name, weight, rulesPrimary, rulesSecondary }) => ({
              id,
              name,
              weight,
              rules: [...rulesPrimary, ...rulesSecondary].map(
                ({ condition, primaryTraitElementId: left, secondaryTraitElementId: right }) => ({
                  type: condition as v.RulesType,
                  with: left === id ? right : left,
                })
              ),
            })),
          })) as v.Layer[] as Prisma.JsonArray,
        },
      })

      try {
        await createIngestInstance().send({
          name: 'repository-deployment/images.create',
          data: {
            repositoryId: deployment.repositoryId,
            deploymentId: deployment.id,
            attributes: deployment.attributes as Prisma.JsonArray,
          },
        })
      } catch (e) {
        console.error(e)
        await ctx.prisma.repositoryDeployment.update({
          where: { id: deployment.id },
          data: { status: RepositoryDeploymentStatus.FAILED },
        })
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Issue when creating deployment. Try again later...' })
      }

      return deployment
    }),
  deleteDeployment: protectedProcedure
    .input(
      z.object({
        deploymentId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { deploymentId } = input

      const deployment = await ctx.prisma.repositoryDeployment.findFirst({
        where: { id: deploymentId },
      })

      if (!deployment) {
        throw new TRPCError({ code: 'NOT_FOUND' })
      }

      await storage.bucket(`elevate-${deployment.repositoryId}-assets`).deleteFiles({
        prefix: `${deploymentId}`,
      })

      await ctx.prisma.repositoryDeployment.delete({
        where: { id: deploymentId },
      })

      return deployment
    }),
  createContractDeployment: protectedProcedure
    .input(
      z.object({
        deploymentId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { deploymentId } = input

      const deployment = await ctx.prisma.repositoryDeployment.findFirst({
        where: { id: deploymentId },
      })

      if (!deployment) {
        throw new TRPCError({ code: 'NOT_FOUND' })
      }

      // @todo remove mock data
      await ctx.prisma.repositoryContractDeployment.create({
        data: {
          repositoryDeploymentId: deploymentId,
          address: '0x123',
          repositoryId: deployment.repositoryId,
        },
      })

      // try {
      //   await createIngestInstance().send({
      //     name: 'repository-deployment/contract.create',
      //     data: {
      //       repositoryId: deployment,
      //     },
      //   })
      // } catch (e) {
      //   console.error(e)
      //   await ctx.prisma.repositoryDeployment.update({
      //     where: { id: deployment.id },
      //     data: { status: RepositoryDeploymentStatus.FAILED },
      //   })
      //   throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Issue when creating deployment. Try again later...' })
      // }
    }),
})
