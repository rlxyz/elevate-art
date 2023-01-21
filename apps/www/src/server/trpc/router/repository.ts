import type { Prisma } from '@prisma/client'
import { AssetDeploymentBranch, AssetDeploymentStatus, AssetDeploymentType, ContractDeploymentStatus } from '@prisma/client'
import { getAssetDeploymentBucket } from '@server/utils/gcp-storage'
import { createIngestInstance } from '@server/utils/inngest'
import { TRPCError } from '@trpc/server'
import Big from 'big.js'
import { ethers } from 'ethers'
import { toPascalCaseWithSpace } from 'src/client/utils/format'
import { env } from 'src/env/server.mjs'
import type * as v from 'src/shared/compiler'
import { z } from 'zod'
import { protectedProcedure, publicProcedure, router } from '../trpc'

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
  hasProductionDeployment: publicProcedure
    .input(
      z.object({
        repositoryName: z.string(),
        organisationName: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { repositoryName: r, organisationName: o } = input
      const repository = await ctx.prisma.repository.findFirst({ where: { name: r, organisation: { name: o } } })
      if (!repository) {
        throw new TRPCError({ code: 'NOT_FOUND' })
      }
      return !!(await ctx.prisma.assetDeployment.findFirst({
        where: { repositoryId: repository.id, branch: AssetDeploymentBranch.PRODUCTION },
      }))
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
          tokenName: toPascalCaseWithSpace(name),
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
        include: {
          contractDeployment: true,
          creator: {
            select: {
              address: true,
            },
          },
        },
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
      const { user } = ctx.session

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
          branch: AssetDeploymentBranch.PREVIEW,
          status: AssetDeploymentStatus.PENDING,
          type, // AssetDeploymentType: Basic/Generative/etc
          creatorId: user.id,
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
        include: {
          creator: {
            select: {
              address: true,
            },
          },
        },
      })

      try {
        await createIngestInstance().send({
          name: 'repository-deployment/images.bundle.create',
          data: {
            branch: assetDeployment.branch,
            type: assetDeployment.type,
            repositoryId: assetDeployment.repositoryId,
            deploymentId: assetDeployment.id,
            layerElements: assetDeployment.layerElements as Prisma.JsonArray,
          },
        })
      } catch (e) {
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

      await getAssetDeploymentBucket({
        branch: deployment.branch,
      }).deleteFiles({
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
        include: {
          assetDeployment: true,
        },
      })
    }),
  updateDescription: protectedProcedure
    .input(
      z.object({
        repositoryId: z.string(),
        description: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { repositoryId, description } = input

      const repository = await ctx.prisma.repository.findFirst({
        where: { id: repositoryId },
      })

      if (!repository) {
        throw new TRPCError({ code: 'NOT_FOUND' })
      }

      return await ctx.prisma.repository.update({
        where: { id: repositoryId },
        data: { description },
      })
    }),
  updateTokenName: protectedProcedure
    .input(
      z.object({
        repositoryId: z.string(),
        tokenName: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { repositoryId, tokenName } = input

      const repository = await ctx.prisma.repository.findFirst({
        where: { id: repositoryId },
      })

      if (!repository) {
        throw new TRPCError({ code: 'NOT_FOUND' })
      }

      return await ctx.prisma.repository.update({
        where: { id: repositoryId },
        data: { tokenName },
      })
    }),

  updateArtistName: protectedProcedure
    .input(
      z.object({
        repositoryId: z.string(),
        artist: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { repositoryId, artist } = input

      const repository = await ctx.prisma.repository.findFirst({
        where: { id: repositoryId },
      })

      if (!repository) {
        throw new TRPCError({ code: 'NOT_FOUND' })
      }

      return await ctx.prisma.repository.update({
        where: { id: repositoryId },
        data: { artist },
      })
    }),

  updateExternalUrl: protectedProcedure
    .input(
      z.object({
        repositoryId: z.string(),
        externalUrl: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { repositoryId, externalUrl } = input

      const repository = await ctx.prisma.repository.findFirst({
        where: { id: repositoryId },
      })

      if (!repository) {
        throw new TRPCError({ code: 'NOT_FOUND' })
      }

      return await ctx.prisma.repository.update({
        where: { id: repositoryId },
        data: { externalUrl },
      })
    }),
  updateLicense: protectedProcedure
    .input(
      z.object({
        repositoryId: z.string(),
        license: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { repositoryId, license } = input

      const repository = await ctx.prisma.repository.findFirst({
        where: { id: repositoryId },
      })

      if (!repository) {
        throw new TRPCError({ code: 'NOT_FOUND' })
      }

      return await ctx.prisma.repository.update({
        where: { id: repositoryId },
        data: { license },
      })
    }),
  updateWidth: protectedProcedure
    .input(
      z.object({
        repositoryId: z.string(),
        width: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { repositoryId, width } = input

      const repository = await ctx.prisma.repository.findFirst({
        where: { id: repositoryId },
      })

      if (!repository) {
        throw new TRPCError({ code: 'NOT_FOUND' })
      }

      return await ctx.prisma.repository.update({
        where: { id: repositoryId },
        data: { width },
      })
    }),
  updateHeight: protectedProcedure
    .input(
      z.object({
        repositoryId: z.string(),
        height: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { repositoryId, height } = input

      const repository = await ctx.prisma.repository.findFirst({
        where: { id: repositoryId },
      })

      if (!repository) {
        throw new TRPCError({ code: 'NOT_FOUND' })
      }

      return await ctx.prisma.repository.update({
        where: { id: repositoryId },
        data: { height },
      })
    }),
  promoteAssetDeployment: protectedProcedure
    .input(
      z.object({
        deploymentId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // change branch to AssetDeploymentBranch.PRODUCTION
      const { deploymentId } = input

      const deployment = await ctx.prisma.assetDeployment.findFirst({
        where: { id: deploymentId },
      })

      if (!deployment) {
        throw new TRPCError({ code: 'NOT_FOUND' })
      }

      // find if there is a production deployment
      const productionDeployment = await ctx.prisma.assetDeployment.findFirst({
        where: {
          repositoryId: deployment.repositoryId,
          branch: AssetDeploymentBranch.PRODUCTION,
        },
      })

      if (productionDeployment) {
        await ctx.prisma.assetDeployment.update({
          where: { id: productionDeployment.id },
          data: { branch: AssetDeploymentBranch.PREVIEW },
        })
      }

      await ctx.prisma.assetDeployment.update({
        where: { id: deploymentId },
        data: { branch: AssetDeploymentBranch.PRODUCTION },
      })

      return {
        oldProductionDeployment: productionDeployment,
      }
    }),
})
