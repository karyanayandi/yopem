import { TRPCError } from "@trpc/server"
import { and, count, desc, eq, sql } from "drizzle-orm"
import { z } from "zod"

import {
  adminProtectedProcedure,
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/lib/api/trpc"
import {
  articleAuthors,
  articleEditors,
  articles,
  articleTopics,
  articleTranslationPrimaries,
} from "@/lib/db/schema/article"
import { medias } from "@/lib/db/schema/media"
import { topics } from "@/lib/db/schema/topic"
import { users } from "@/lib/db/schema/user"
import { cuid, slugify, trimText, uniqueCharacter } from "@/lib/utils"
import {
  createArticleSchema,
  translateArticleSchema,
  updateArticleSchema,
} from "@/lib/validation/article"
import { LANGUAGE_TYPE } from "@/lib/validation/language"

// TODO: add route ByTopic
// TODO: add route relatedArticles
// TODO: add route byTopics
// TODO: add route byAuthors
// TODO: add route delete

export const articleRouter = createTRPCRouter({
  all: publicProcedure.query(async ({ ctx }) => {
    try {
      const data = await ctx.db.query.articles.findMany({
        with: {
          featuredImage: true,
        },
        orderBy: (articles, { desc }) => [desc(articles.id)],
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
  articleTranslationPrimaryById: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      try {
        const data = await ctx.db.query.articleTranslationPrimaries.findFirst({
          where: (articleTranslationPrimaries, { eq }) =>
            eq(articleTranslationPrimaries.id, input),
          with: {
            articles: {
              columns: {
                id: true,
                title: true,
                language: true,
              },
              with: {
                featuredImage: {
                  columns: {
                    id: true,
                    url: true,
                  },
                },
                topics: {
                  columns: {
                    topicId: true,
                  },
                },
                authors: true,
                editors: true,
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
        const data = await ctx.db
          .select()
          .from(articles)
          .leftJoin(articleTopics, eq(topics.id, articleTopics.topicId))
          .leftJoin(articleAuthors, eq(users.id, articleAuthors.userId))
          .leftJoin(articleEditors, eq(users.id, articleEditors.userId))
          .leftJoin(medias, eq(medias.id, articles.featuredImageId))
          .where(eq(articles.id, input))
          .limit(1)

        return data
      } catch (error) {
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
      const data = await ctx.db
        .select()
        .from(articles)
        .leftJoin(articleTopics, eq(topics.id, articleTopics.topicId))
        .leftJoin(articleAuthors, eq(users.id, articleAuthors.userId))
        .leftJoin(articleEditors, eq(users.id, articleEditors.userId))
        .leftJoin(medias, eq(medias.id, articles.featuredImageId))
        .where(eq(articles.slug, input))
        .limit(1)

      return data
    } catch (error) {
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
        language: z.enum(LANGUAGE_TYPE),
        page: z.number(),
        perPage: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const data = await ctx.db.query.articles.findMany({
          where: (articles, { eq, and }) =>
            and(
              eq(articles.language, input.language),
              eq(articles.status, "published"),
              // not(
              //   eq(
              //     articleTopics.articleId,
              //     "de749d11-2438-4521-99a1-847f5d37b103",
              //   ),
              // ),
            ),
          limit: input.perPage,
          offset: (input.page - 1) * input.perPage,
          orderBy: (articles, { desc }) => [desc(articles.updatedAt)],
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
  byLanguageInfinite: publicProcedure
    .input(
      z.object({
        language: z.enum(LANGUAGE_TYPE),
        limit: z.number().min(1).max(100).nullable(),
        cursor: z.string().optional().nullable(),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const limit = input.limit ?? 50

        const data = await ctx.db.query.articles.findMany({
          where: input.cursor
            ? (articles, { eq, and, lt }) =>
                and(
                  eq(articles.language, input.language),
                  eq(articles.status, "published"),
                  // not(
                  //   eq(
                  //     articleTopics.articleId,
                  //     "de749d11-2438-4521-99a1-847f5d37b103",
                  //   ),
                  // ),
                  lt(articles.updatedAt, input.cursor!),
                )
            : undefined,
          limit: limit,
        })

        let nextCursor: string | undefined = undefined

        if (data.length > limit) {
          const nextItem = data.pop()
          if (nextItem?.updatedAt) {
            nextCursor = nextItem.updatedAt
          }
        }

        return {
          articles: data,
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
  dashboard: adminProtectedProcedure
    .input(
      z.object({
        language: z.enum(LANGUAGE_TYPE),
        page: z.number(),
        perPage: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        // const data = await ctx.db
        //   .select()
        //   .from(articles)
        //   // .leftJoin(articleTopics, eq(topics.id, articleTopics.topicId))
        //   // .leftJoin(articleAuthors, eq(users.id, articleAuthors.userId))
        //   .leftJoin(
        //     articleTranslationPrimaries,
        //     eq(
        //       articles.articleTranslationPrimaryId,
        //       articleTranslationPrimaries.id,
        //     ),
        //   )
        //   // TODO: add articles inside articleTranslationPrimaries
        //   .where(eq(articles.language, input.language))
        //   .orderBy(desc(articles.updatedAt))
        //   .limit(input.perPage)
        //   .offset((input.page - 1) * input.perPage)
        //   .all()
        //
        // const article = data.map((item) => ({
        //   ...item.article,
        //   article_translation_primary: item.article_translation_primary,
        // }))

        // return article

        const data = await ctx.db.query.articles.findMany({
          where: (articles, { eq }) => eq(articles.language, input.language),
          limit: input.perPage,
          offset: (input.page - 1) * input.perPage,
          orderBy: (articles, { desc }) => [desc(articles.updatedAt)],
          with: {
            featuredImage: {
              columns: {
                id: true,
                url: true,
              },
            },
            articleTranslationPrimary: {
              columns: {
                id: true,
              },
              with: {
                articles: {
                  columns: {
                    id: true,
                    title: true,
                    language: true,
                  },
                },
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
  sitemap: publicProcedure
    .input(
      z.object({
        language: z.enum(LANGUAGE_TYPE),
        page: z.number(),
        perPage: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const data = await ctx.db.query.articles.findMany({
          where: (articles, { eq, and }) =>
            and(
              eq(articles.language, input.language),
              eq(articles.status, "published"),
            ),
          columns: {
            slug: true,
            updatedAt: true,
          },
          limit: input.perPage,
          offset: (input.page - 1) * input.perPage,
          orderBy: (articles, { desc }) => [desc(articles.id)],
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
      const data = await ctx.db
        .select({ value: count() })
        .from(articles)
        .where(and(eq(articles.status, "published")))

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
  countDashboard: publicProcedure.query(async ({ ctx }) => {
    try {
      const data = await ctx.db.select({ value: count() }).from(articles)

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
    .input(z.enum(LANGUAGE_TYPE))
    .query(async ({ ctx, input }) => {
      try {
        const data = await ctx.db
          .select({ values: count() })
          .from(articles)
          .where(
            and(eq(articles.language, input), eq(articles.status, "published")),
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
  search: publicProcedure
    .input(
      z.object({ language: z.enum(LANGUAGE_TYPE), searchQuery: z.string() }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const data = await ctx.db.query.articles.findMany({
          where: (articles, { eq, and, or, like }) =>
            and(
              eq(articles.language, input.language),
              eq(articles.status, "published"),
              or(
                like(articles.title, `%${input.searchQuery}%`),
                like(articles.slug, `%${input.searchQuery}%`),
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
    .input(
      z.object({ language: z.enum(LANGUAGE_TYPE), searchQuery: z.string() }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const data = await ctx.db.query.articles.findMany({
          where: (articles, { eq, and, or, like }) =>
            and(
              eq(articles.language, input.language),
              eq(articles.status, "published"),
              or(
                like(articles.title, `%${input.searchQuery}%`),
                like(articles.slug, `%${input.searchQuery}%`),
              ),
            ),
          with: {
            featuredImage: true,
            articleTranslationPrimary: {
              with: {
                articles: true,
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
  create: adminProtectedProcedure
    .input(createArticleSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const slug = `${slugify(input.title)}_${uniqueCharacter()}`
        const generatedExcerpt = !input.excerpt
          ? trimText(input.content, 160)
          : input.excerpt
        const generatedMetaTitle = !input.metaTitle
          ? input.title
          : input.metaTitle
        const generatedMetaDescription = !input.metaDescription
          ? generatedExcerpt
          : input.metaDescription

        const articleTranslationPrimaryId = cuid()
        const articleId = cuid()

        const data = await ctx.db.transaction(async (tx) => {
          const articleTranslationPrimary = await tx
            .insert(articleTranslationPrimaries)
            .values({
              id: articleTranslationPrimaryId,
            })
            .returning()

          await tx.insert(articles).values({
            id: articleId,
            language: input.language,
            title: input.title,
            slug: slug,
            content: input.content,
            status: input.status,
            excerpt: generatedExcerpt,
            metaTitle: generatedMetaTitle,
            metaDescription: generatedMetaDescription,
            featuredImageId: input.featuredImageId,
            articleTranslationPrimaryId: articleTranslationPrimary[0].id,
            //TODO: connect authors, editors, and topics
          })
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
    .input(updateArticleSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        //TODO: update authors, editors, and topics too

        const data = await ctx.db
          .update(articles)
          .set({
            ...input,
            updatedAt: sql`CURRENT_TIMESTAMP`,
          })
          .where(eq(articles.id, input.id))

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
  updateWithoutChangeUpdatedDate: adminProtectedProcedure
    .input(updateArticleSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        //TODO: update authors, editors, and topics too

        const data = await ctx.db
          .update(articles)
          .set({
            ...input,
          })
          .where(eq(articles.id, input.id))

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
    .input(translateArticleSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const slug = `${slugify(input.title)}_${uniqueCharacter()}`
        const generatedExcerpt = !input.excerpt
          ? trimText(input.content, 160)
          : input.excerpt
        const generatedMetaTitle = !input.metaTitle
          ? input.title
          : input.metaTitle
        const generatedMetaDescription = !input.metaDescription
          ? generatedExcerpt
          : input.metaDescription

        const data = await ctx.db.insert(articles).values({
          id: cuid(),
          language: input.language,
          title: input.title,
          slug: slug,
          content: input.content,
          status: input.status,
          excerpt: generatedExcerpt,
          metaTitle: generatedMetaTitle,
          metaDescription: generatedMetaDescription,
          featuredImageId: input.featuredImageId,
          articleTranslationPrimaryId: input.articleTranslationPrimaryId,
          //TODO: connect authors, editors, and topics
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
  // delete: protectedProcedure
  //   .input(z.string())
  //   .mutation(async ({ ctx, input }) => {
  //     try {
  //       const article = await ctx.db.query.articles.findFirst({
  //         where: (articles, { eq }) => eq(articles.id, input),
  //       })
  //
  //       const isUserAuthor = article?.authors.some(
  //         (author) => author.id === ctx.session.user.id,
  //       )
  //
  //       if (!isUserAuthor) {
  //         throw new TRPCError({
  //           code: "UNAUTHORIZED",
  //           message: "Only the author of the article is allowed to delete it.",
  //         })
  //       }
  //
  //       const data = await ctx.db.delete(articles).where(eq(articles.id, input))
  //
  //       return data
  //     } catch (error) {
  //       console.error("Error:", error)
  //       if (error instanceof TRPCError) {
  //         throw error
  //       } else {
  //         throw new TRPCError({
  //           code: "INTERNAL_SERVER_ERROR",
  //           message: "An internal error occurred",
  //         })
  //       }
  //     }
  //   }),
  deleteByAdmin: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      try {
        const data = await ctx.db.delete(articles).where(eq(articles.id, input))

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
