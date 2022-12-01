import { RulesEnum } from "@elevateart/compiler";
import { z } from "zod";
import { protectedProcedure, router } from "../trpc";

/**
 * Rules Router
 * Any TraitElement Rules functionality should implemented here.
 */
export const ruleRouter = router({
  /**
   * Creates a Rule with two associated TraitElements and a "condition" based on the compiler's supported conditions.
   */
  create: protectedProcedure
    .input(
      z.object({
        condition: RulesEnum,
        traitElements: z.tuple([z.string(), z.string()]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { condition, traitElements } = input;
      return await ctx.prisma.rules.create({
        data: {
          condition,
          primaryTraitElementId: traitElements[0],
          secondaryTraitElementId: traitElements[1],
        },
      });
    }),
  /**
   * Creates a Rule with two associated TraitElements and a "condition" based on the compiler's supported conditions.
   */
  delete: protectedProcedure.input(z.object({ ruleId: z.string() })).mutation(async ({ ctx, input }) => {
    const { ruleId } = input;
    return await ctx.prisma.rules.delete({ where: { id: ruleId } });
  }),
});
