import { TRPCError } from "@trpc/server"
import { and, count, eq, sql } from "drizzle-orm"
import { z } from "zod"

import {
  adminProtectedProcedure,
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/lib/api/trpc"
import { articleComments } from "@/lib/db/schema/article-comment"
import { cuid } from "@/lib/utils"
import {
  createArticleCommentSchema,
  updateArticleCommentSchema,
} from "@/lib/validation/article-comment"

export const articleCommentRouter = createTRPCRouter({
  dashboard: adminProtectedProcedure
    .input(z.object({ page: z.number(), perPage: z.number() }))
    .query(async ({ ctx, input }) => {
      try {
        const data = await ctx.db.query.articleComments.findMany({
          limit: input.perPage,
          offset: (input.page - 1) * input.perPage,
          orderBy: (articleComments, { desc }) => [
            desc(articleComments.createdAt),
          ],
          with: {
            article: true,
          },
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
  byArticleId: publicProcedure
    .input(
      z.object({
        articleId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const data = await ctx.db.query.articleComments.findMany({
          where: (articleComments, { eq }) =>
            eq(articleComments.articleId, input.articleId),
          orderBy: (articleComments, { desc }) => [
            desc(articleComments.createdAt),
          ],
          with: {
            author: true,
            replies: {
              with: {
                author: true,
              },
            },
          },
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
  byArticleIdInfinite: publicProcedure
    .input(
      z.object({
        articleId: z.string(),
        limit: z.number().min(1).max(100).nullable(),
        cursor: z.string().nullable().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const limit = input.limit ?? 50

        const data = await ctx.db.query.articleComments.findMany({
          where: (articleComments, { eq, and, lt }) =>
            and(
              eq(articleComments.articleId, input.articleId),
              eq(articleComments.replyToId, ""),
              input.cursor
                ? lt(articleComments.updatedAt, input.cursor)
                : undefined,
            ),
          limit: limit + 1,
          with: {
            author: true,
            replies: {
              with: {
                author: true,
              },
            },
          },
        })

        let nextCursor: string | undefined = undefined

        if (data.length > limit) {
          const nextItem = data.pop()
          if (nextItem?.createdAt) {
            nextCursor = nextItem.createdAt
          }
        }

        return {
          articleComments: data,
          nextCursor,
        }
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
  byId: publicProcedure.input(z.string()).query(async ({ ctx, input }) => {
    try {
      const data = await ctx.db.query.articleComments.findMany({
        where: (articleComments, { eq }) => eq(articleComments.id, input),
        with: {
          replies: {
            with: {
              author: true,
            },
          },
        },
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
  count: publicProcedure.query(async ({ ctx }) => {
    try {
      const data = await ctx.db.select({ value: count() }).from(articleComments)

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
  countByArticleId: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      try {
        const data = await ctx.db
          .select({ value: count() })
          .from(articleComments)
          .where(
            and(
              eq(articleComments.id, input),
              eq(articleComments.replyToId, ""),
            ),
          )

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
  create: protectedProcedure
    .input(createArticleCommentSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const data = await ctx.db.insert(articleComments).values({
          id: cuid(),
          articleId: input.articleId,
          content: input.content,
          replyToId: input.replyToId ?? "",
          authorId: ctx.session.user.id,
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
    .input(updateArticleCommentSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const articleComment = await ctx.db.query.articleComments.findFirst({
          where: (articleComments, { eq }) => eq(articleComments.id, input.id),
          with: {
            author: true,
          },
        })

        const isUserAuthor = articleComment?.author?.id === ctx.session.user.id

        if (!isUserAuthor) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message:
              "Only the author of the article comment is allowed to update it.",
          })
        }

        const data = await ctx.db
          .update(articleComments)
          .set({
            ...input,
            updatedAt: sql`CURRENT_TIMESTAMP`,
          })
          .where(eq(articleComments.id, input.id))

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
    .input(updateArticleCommentSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const data = await ctx.db
          .update(articleComments)
          .set({
            ...input,
            updatedAt: sql`CURRENT_TIMESTAMP`,
          })
          .where(eq(articleComments.id, input.id))

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
  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      try {
        const articleComment = await ctx.db.query.articleComments.findFirst({
          where: (articleComments, { eq }) => eq(articleComments.id, input),
          with: {
            author: true,
          },
        })

        const isUserAuthor = articleComment?.author?.id === ctx.session.user.id

        if (!isUserAuthor) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message:
              "Only the author of the article comment is allowed to delete it.",
          })
        }

        const data = await ctx.db
          .delete(articleComments)
          .where(eq(articleComments.id, input))

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
          .delete(articleComments)
          .where(eq(articleComments.id, input))

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
