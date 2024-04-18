import { TRPCError } from "@trpc/server"
import { eq, sql } from "drizzle-orm"
import { z } from "zod"

import {
  adminProtectedProcedure,
  createTRPCRouter,
  protectedProcedure,
} from "@/lib/api/trpc"
import { userLinks } from "@/lib/db/schema"
import { cuid } from "@/lib/utils"
import {
  createUserLinkSchema,
  updateUserLinkSchema,
} from "@/lib/validation/user-link"

export const userLinkRouter = createTRPCRouter({
  dashboard: adminProtectedProcedure
    .input(z.object({ page: z.number(), perPage: z.number() }))
    .query(async ({ ctx, input }) => {
      try {
        const data = await ctx.db.query.userLinks.findMany({
          limit: input.perPage,
          offset: (input.page - 1) * input.perPage,
          orderBy: (userLinks, { desc }) => [desc(userLinks.createdAt)],
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
        const data = await ctx.db.query.userLinks.findFirst({
          where: (userLinks, { eq }) => eq(userLinks.id, input),
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
  create: protectedProcedure
    .input(createUserLinkSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const data = await ctx.db.insert(userLinks).values({
          id: cuid(),
          title: input.title,
          url: input.url,
          userId: ctx.user?.id!,
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
  update: protectedProcedure
    .input(updateUserLinkSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const isUser = await ctx.db.query.users.findFirst({
          where: (users, { eq }) => eq(users.id, ctx.session.user.id),
        })

        if (!isUser) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "You can only update your link.",
          })
        }

        const data = await ctx.db
          .update(userLinks)
          .set({
            ...input,
            updatedAt: sql`CURRENT_TIMESTAMP`,
          })
          .where(eq(userLinks.id, input.id))

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
  updateByAdmin: adminProtectedProcedure
    .input(updateUserLinkSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const data = await ctx.db
          .update(userLinks)
          .set({
            ...input,
            updatedAt: sql`CURRENT_TIMESTAMP`,
          })
          .where(eq(userLinks.id, input.id))

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
        const isUser = await ctx.db.query.users.findFirst({
          where: (users, { eq }) => eq(users.id, ctx.user?.id!),
        })

        if (!isUser) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "You can only delete your link.",
          })
        }

        const data = await ctx.db
          .delete(userLinks)
          .where(eq(userLinks.id, input))

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
  deleteByAdmin: adminProtectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      try {
        const data = await ctx.db
          .delete(userLinks)
          .where(eq(userLinks.id, input))

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
