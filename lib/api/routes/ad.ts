import { TRPCError } from "@trpc/server"
import { count, eq, sql } from "drizzle-orm"
import { z } from "zod"

import {
  adminProtectedProcedure,
  createTRPCRouter,
  publicProcedure,
} from "@/lib/api/trpc"
import { ads } from "@/lib/db/schema/ad"
import { cuid } from "@/lib/utils"
import { adPosition, createAdSchema, updateAdSchema } from "@/lib/validation/ad"

export const adRouter = createTRPCRouter({
  dashboard: adminProtectedProcedure
    .input(z.object({ page: z.number(), perPage: z.number() }))
    .query(async ({ ctx, input }) => {
      try {
        const data = await ctx.db.query.ads.findMany({
          limit: input.perPage,
          offset: (input.page - 1) * input.perPage,
          orderBy: (ads, { desc }) => [desc(ads.createdAt)],
        })

        return data
      } catch (error) {
        console.error("Error:", error)
        if (error instanceof TRPCError) {
          throw error
        } else {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "An internal error occurred",
          })
        }
      }
    }),
  byId: adminProtectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      try {
        const data = await ctx.db.query.ads.findFirst({
          where: (ads, { eq }) => eq(ads.id, input),
        })

        return data
      } catch (error) {
        console.error("Error:", error)
        if (error instanceof TRPCError) {
          throw error
        } else {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "An internal error occurred",
          })
        }
      }
    }),
  byPosition: publicProcedure
    .input(adPosition)
    .query(async ({ ctx, input }) => {
      try {
        const data = await ctx.db.query.ads.findMany({
          where: (ads, { eq }) => eq(ads.position, input),
        })

        return data
      } catch (error) {
        console.error("Error:", error)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Ad not found",
        })
      }
    }),
  count: adminProtectedProcedure.query(async ({ ctx }) => {
    try {
      const data = await ctx.db.select({ value: count() }).from(ads)

      return data[0].value
    } catch (error) {
      console.error("Error:", error)
      if (error instanceof TRPCError) {
        throw error
      } else {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An internal error occurred",
        })
      }
    }
  }),
  create: adminProtectedProcedure
    .input(createAdSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const data = await ctx.db.insert(ads).values({
          id: cuid(),
          ...input,
        })

        return data
      } catch (error) {
        console.error("Error:", error)
        if (error instanceof TRPCError) {
          throw error
        } else {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "An internal error occurred",
          })
        }
      }
    }),
  update: adminProtectedProcedure
    .input(updateAdSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const data = await ctx.db
          .update(ads)
          .set({
            ...input,
            updatedAt: sql`CURRENT_TIMESTAMP`,
          })
          .where(eq(ads.id, input.id))

        return data
      } catch (error) {
        console.error("Error:", error)
        if (error instanceof TRPCError) {
          throw error
        } else {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "An internal error occurred",
          })
        }
      }
    }),
  delete: adminProtectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      try {
        const data = await ctx.db.delete(ads).where(eq(ads.id, input))
        return data
      } catch (error) {
        console.error("Error:", error)
        if (error instanceof TRPCError) {
          throw error
        } else {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "An internal error occurred",
          })
        }
      }
    }),
})
