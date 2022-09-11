import { z } from 'zod'
import { createRouter } from './context'
// const cloudinary = require('cloudinary').v2

export const traitElementRouter = createRouter()
  .mutation('updateWeightMany', {
    input: z.object({
      traits: z.array(
        z.object({
          id: z.string(),
          weight: z.number(),
        })
      ),
    }),
    async resolve({ ctx, input }) {
      input.traits.forEach(async ({ id, weight }) => {
        await ctx.prisma.traitElement.update({
          where: {
            id,
          },
          data: {
            weight,
          },
        })
      })
    },
  })
  .mutation('setRuleById', {
    input: z.object({
      type: z.string(),
      primaryTraitElementId: z.string(),
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
      return {
        layers: await ctx.prisma.layerElement.findMany({
          where: {
            repositoryId: input.repositoryId,
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
        }),
        primary: await ctx.prisma.traitElement.findFirst({
          where: {
            id: input.primaryTraitElementId,
          },
          include: {
            layerElement: true,
          },
        }),
        secondary: await ctx.prisma.traitElement.findFirst({
          where: {
            id: input.secondaryTraitElementId,
          },
          include: {
            layerElement: true,
          },
        }),
      }
    },
  })
  .mutation('deleteRuleById', {
    input: z.object({
      repositoryId: z.string(),
      id: z.string(),
    }),
    async resolve({ ctx, input }) {
      const data = await ctx.prisma.rules.findFirst({
        where: {
          id: input.id,
        },
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
      })

      await ctx.prisma.rules.delete({
        where: {
          id: input.id,
        },
      })

      return {
        deletedRule: { ...data },
        layers: await ctx.prisma.layerElement.findMany({
          where: {
            repositoryId: input.repositoryId,
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
        }),
      }
    },
  })
  .mutation('setNameById', {
    input: z.object({
      repositoryId: z.string(),
      id: z.string(),
      oldName: z.string(),
      newName: z.string(),
    }),
    async resolve({ ctx, input }) {
      await ctx.prisma.traitElement.update({
        where: {
          id: input.id,
        },
        data: {
          name: input.newName,
        },
      })

      return {
        layers: await ctx.prisma.layerElement.findMany({
          where: {
            repositoryId: input.repositoryId,
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
        }),
      }
    },
  })
  .query('getTraitManyByLayerElementId', {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ ctx, input }) {
      return ctx.prisma.traitElement.findMany({
        where: {
          layerElementId: input.id,
        },
      })
    },
  })
