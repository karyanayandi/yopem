import { TRPCError } from "@trpc/server"
import { and, count, desc, eq, sql } from "drizzle-orm"
import { z } from "zod"

import {
  adminProtectedProcedure,
  createTRPCRouter,
  publicProcedure,
} from "@/lib/api/trpc"
import { articleTopics } from "@/lib/db/schema/article"
import { topics, topicTranslations } from "@/lib/db/schema/topic"
import { cuid, slugify, uniqueCharacter } from "@/lib/utils"
import { languageType } from "@/lib/validation/language"
import {
  createTopicSchema,
  topicType,
  topicVisibility,
  translateTopicSchema,
  updateTopicSchema,
} from "@/lib/validation/topic"

export const topicRouter = createTRPCRouter({
  topicTranslationById: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      try {
        const data = await ctx.db.query.topicTranslations.findFirst({
          where: (topicTranslations, { eq }) => eq(topicTranslations.id, input),
          with: {
            topics: true,
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
  dashboard: adminProtectedProcedure
    .input(
      z.object({
        language: languageType,
        page: z.number(),
        perPage: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const data = await ctx.db.query.topics.findMany({
          where: (topics, { eq }) => eq(topics.language, input.language),
          limit: input.perPage,
          offset: (input.page - 1) * input.perPage,
          orderBy: (users, { desc }) => [desc(users.updatedAt)],
          with: {
            topicTranslation: {
              with: {
                topics: true,
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
  byId: adminProtectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      try {
        const data = await ctx.db.query.topics.findFirst({
          where: (topics, { eq }) => eq(topics.id, input),
          with: {
            featuredImage: true,
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
  byLanguage: publicProcedure
    .input(
      z.object({
        language: languageType,
        page: z.number(),
        perPage: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const data = await ctx.db.query.topics.findMany({
          where: (topics, { and, eq }) =>
            and(
              eq(topics.language, input.language),
              eq(topics.status, "published"),
            ),
          limit: input.perPage,
          offset: (input.page - 1) * input.perPage,
          orderBy: (topics, { desc }) => [desc(topics.createdAt)],
          with: {
            featuredImage: true,
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
  byArticleCount: publicProcedure
    .input(
      z.object({
        language: languageType,
        page: z.number(),
        perPage: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const data = await ctx.db
          .select({
            id: topics.id,
            title: topics.title,
            slug: topics.slug,
            language: topics.language,
            count: sql<number>`count(${articleTopics.articleId})`.mapWith(
              Number,
            ),
          })
          .from(topics)
          .where(
            and(
              eq(topics.language, input.language),
              eq(topics.status, "published"),
              eq(topics.visibility, "public"),
            ),
          )
          .leftJoin(articleTopics, eq(articleTopics.topicId, topics.id))
          .limit(input.perPage)
          .offset((input.page - 1) * input.perPage)
          .groupBy(topics.id)
          .orderBy(desc(count(articleTopics.articleId)))

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
  sitemap: publicProcedure
    .input(
      z.object({
        language: languageType,
        page: z.number(),
        perPage: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const data = await ctx.db.query.topics.findMany({
          where: (topics, { eq, and }) =>
            and(
              eq(topics.language, input.language),
              eq(topics.status, "published"),
            ),
          limit: input.perPage,
          offset: (input.page - 1) * input.perPage,
          orderBy: (topics, { desc }) => [desc(topics.updatedAt)],
          columns: {
            slug: true,
            updatedAt: true,
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
  byType: publicProcedure
    .input(
      z.object({
        type: topicType,
        language: languageType,
        page: z.number(),
        perPage: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const data = await ctx.db.query.topics.findMany({
          where: (topics, { eq, and }) =>
            and(
              eq(topics.type, input.type),
              eq(topics.language, input.language),
              eq(topics.status, "published"),
            ),
          limit: input.perPage,
          offset: (input.page - 1) * input.perPage,
          orderBy: (topics, { desc }) => [desc(topics.updatedAt)],
          with: {
            featuredImage: true,
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
  byVisibility: publicProcedure
    .input(
      z.object({
        visibility: topicVisibility,
        language: languageType,
        page: z.number(),
        perPage: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const data = await ctx.db.query.topics.findMany({
          where: (topics, { eq, and }) =>
            and(
              eq(topics.visibility, input.visibility),
              eq(topics.language, input.language),
              eq(topics.status, "published"),
            ),
          limit: input.perPage,
          offset: (input.page - 1) * input.perPage,
          orderBy: (topics, { desc }) => [desc(topics.updatedAt)],
          with: {
            featuredImage: true,
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
  bySlug: publicProcedure.input(z.string()).query(async ({ ctx, input }) => {
    try {
      const data = await ctx.db.query.topics.findFirst({
        where: (topics, { eq }) => eq(topics.slug, input),
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
  search: publicProcedure
    .input(z.object({ language: languageType, searchQuery: z.string() }))
    .query(async ({ ctx, input }) => {
      try {
        const data = await ctx.db.query.topics.findMany({
          where: (topics, { eq, and, or, like }) =>
            and(
              eq(topics.language, input.language),
              eq(topics.visibility, "public"),
              eq(topics.status, "published"),
              or(
                like(topics.title, `%${input.searchQuery}%`),
                like(topics.slug, `%${input.searchQuery}%`),
              ),
            ),
          with: {
            featuredImage: true,
          },
          limit: 10,
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
  searchDashboard: publicProcedure
    .input(z.object({ language: languageType, searchQuery: z.string() }))
    .query(async ({ ctx, input }) => {
      try {
        const data = await ctx.db.query.topics.findMany({
          where: (topics, { eq, and, or, like }) =>
            and(
              eq(topics.language, input.language),
              or(
                like(topics.title, `%${input.searchQuery}%`),
                like(topics.slug, `%${input.searchQuery}%`),
              ),
            ),
          with: {
            featuredImage: true,
            topicTranslation: {
              with: {
                topics: true,
              },
            },
          },
          limit: 10,
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
  searchByType: publicProcedure
    .input(
      z.object({
        type: topicType,
        language: languageType,
        searchQuery: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const data = await ctx.db.query.topics.findMany({
          where: (topics, { eq, and, or, like }) =>
            and(
              eq(topics.type, input.type),
              eq(topics.language, input.language),
              eq(topics.visibility, "public"),
              eq(topics.status, "published"),
              or(
                like(topics.title, `%${input.searchQuery}%`),
                like(topics.slug, `%${input.searchQuery}%`),
              ),
            ),
          with: {
            featuredImage: true,
          },
          limit: 10,
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
      const data = await ctx.db.select({ value: count() }).from(topics)

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
  countByLanguage: publicProcedure
    .input(languageType)
    .query(async ({ ctx, input }) => {
      try {
        const data = await ctx.db
          .select({ values: count() })
          .from(topics)
          .where(
            and(eq(topics.language, input), eq(topics.status, "published")),
          )

        return data[0].values
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
    .input(createTopicSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const slug = `${slugify(input.title)}_${uniqueCharacter()}`
        const generatedMetaTitle = !input.metaTitle
          ? input.title
          : input.metaTitle
        const generatedMetaDescription = !input.metaDescription
          ? input.description
          : input.metaDescription

        const topicTranslationId = cuid()
        const topicId = cuid()

        const topicTranslation = await ctx.db
          .insert(topicTranslations)
          .values({
            id: topicTranslationId,
          })
          .returning()

        const data = await ctx.db
          .insert(topics)
          .values({
            id: topicId,
            language: input.language,
            title: input.title,
            slug: slug,
            description: input.description,
            visibility: input.visibility,
            type: input.type,
            status: input.status,
            metaTitle: generatedMetaTitle,
            metaDescription: generatedMetaDescription,
            featuredImageId: input.featuredImageId,
            topicTranslationId: topicTranslation[0].id,
          })
          .returning()

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
    .input(updateTopicSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const data = await ctx.db
          .update(topics)
          .set({
            ...input,
            updatedAt: sql`CURRENT_TIMESTAMP`,
          })
          .where(eq(topics.id, input.id))

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
  translate: adminProtectedProcedure
    .input(translateTopicSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const slug = `${slugify(input.title)}_${uniqueCharacter()}`
        const generatedMetaTitle = !input.metaTitle
          ? input.title
          : input.metaTitle
        const generatedMetaDescription = !input.metaDescription
          ? input.description
          : input.metaDescription

        const data = await ctx.db.insert(topics).values({
          id: cuid(),
          language: input.language,
          title: input.title,
          slug: slug,
          description: input.description,
          visibility: input.visibility,
          type: input.type,
          status: input.status,
          metaTitle: generatedMetaTitle,
          metaDescription: generatedMetaDescription,
          featuredImageId: input.featuredImageId,
          topicTranslationId: input.topicTranslationId,
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
  delete: adminProtectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      try {
        const data = await ctx.db.batch([
          ctx.db.delete(articleTopics).where(eq(articleTopics.topicId, input)),
          ctx.db.delete(topics).where(eq(topics.id, input)),
        ])

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
