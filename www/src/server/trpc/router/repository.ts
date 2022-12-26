import type { Prisma } from '@prisma/client'
import { AssetDeploymentBranch, AssetDeploymentStatus, AssetDeploymentType, ContractDeploymentStatus } from '@prisma/client'
import { storage } from '@server/utils/gcp-storage'
import { createIngestInstance } from '@server/utils/inngest'
import { TRPCError } from '@trpc/server'
import Big from 'big.js'
import { ethers } from 'ethers'
import { env } from 'src/env/server.mjs'
import type * as v from 'src/shared/compiler'
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
        repositoryName: z.string(),
        organisationName: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { repositoryName: r, organisationName: o } = input
      return await ctx.prisma.repository.findFirst({ where: { name: r, organisation: { name: o } } })
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
  findAllAssetDeployments: protectedProcedure
    .input(
      z.object({
        repositoryId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { repositoryId } = input
      return await ctx.prisma.assetDeployment.findMany({
        where: { repositoryId: repositoryId },
        orderBy: { createdAt: 'desc' },
        include: { contractDeployment: true },
      })
    }),
  findContractDeploymentByName: protectedProcedure
    .input(
      z.object({
        repositoryId: z.string(),
        name: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { repositoryId, name } = input
      const deployment = await ctx.prisma.contractDeployment.findFirst({
        where: { repositoryId: repositoryId, assetDeployment: { name } },
        include: { assetDeployment: true },
      })
      if (!deployment) {
        throw new TRPCError({ code: 'NOT_FOUND' })
      }

      // use etherjs to check if contract has been deployed
      const { address, status } = deployment

      if (status === 'DEPLOYED' || status === 'FAILED') {
        return deployment
      }

      const provider = new ethers.providers.AlchemyProvider(deployment.chainId, env.NEXT_PUBLIC_ALCHEMY_ID)
      const contract = new ethers.Contract(address, [], provider)
      const code = await contract.provider.getCode(address)

      if (code === '0x') {
        return deployment
      }

      // if contract has been deployed, update the deployment status
      // set the state to verifying
      await ctx.prisma.contractDeployment.update({
        where: { id: deployment.id },
        data: { status: ContractDeploymentStatus.DEPLOYED },
      })

      return deployment
    }),
  createAssetDeployment: protectedProcedure
    .input(
      z.object({
        repositoryId: z.string(),
        collectionId: z.string(),
        type: z.nativeEnum(AssetDeploymentType),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { repositoryId, collectionId, type } = input

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

      const assetDeployment = await ctx.prisma.assetDeployment.create({
        data: {
          repositoryId,
          slug: collection.name,
          generations: collection.generations,
          totalSupply: collection.totalSupply,
          status: AssetDeploymentStatus.PENDING,
          branch: AssetDeploymentBranch.PREVIEW,
          type, // AssetDeploymentType: Basic/Generative/etc
          name: (Math.random() + 1).toString(36).substring(4),
          layerElements: layerElements.map(({ id, name, priority, traitElements }) => ({
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
            repositoryId: assetDeployment.repositoryId,
            deploymentId: assetDeployment.id,
            layerElements: assetDeployment.layerElements as Prisma.JsonArray,
          },
        })
      } catch (e) {
        console.error(e)
        await ctx.prisma.assetDeployment.update({
          where: { id: assetDeployment.id },
          data: { status: AssetDeploymentStatus.FAILED },
        })
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Issue when creating deployment. Try again later...' })
      }

      return assetDeployment
    }),
  deleteAssetDeployment: protectedProcedure
    .input(
      z.object({
        deploymentId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { deploymentId } = input

      const deployment = await ctx.prisma.assetDeployment.findFirst({
        where: { id: deploymentId },
      })

      if (!deployment) {
        throw new TRPCError({ code: 'NOT_FOUND' })
      }

      await storage.bucket(`elevate-${deployment.repositoryId}-assets`).deleteFiles({
        prefix: `${deploymentId}`,
      })

      await ctx.prisma.assetDeployment.delete({
        where: { id: deploymentId },
      })

      return deployment
    }),
  createContractDeployment: protectedProcedure
    .input(
      z.object({
        deploymentId: z.string(),
        address: z.string(),
        chainId: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { deploymentId, chainId, address } = input

      const deployment = await ctx.prisma.assetDeployment.findFirst({
        where: { id: deploymentId },
      })

      if (!deployment) {
        throw new TRPCError({ code: 'NOT_FOUND' })
      }

      return await ctx.prisma.contractDeployment.create({
        data: {
          assetDeploymentId: deploymentId,
          chainId,
          address,
          repositoryId: deployment.repositoryId,
        },
      })
    }),
})
