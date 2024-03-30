import { adRouter } from "./routes/ad"
import { articleRouter } from "./routes/article"
import { mediaRouter } from "./routes/media"
import { topicRouter } from "./routes/topic"
import { userRouter } from "./routes/user"
import { userLinkRouter } from "./routes/user-link"
import { createCallerFactory, createTRPCRouter } from "./trpc"

export const appRouter = createTRPCRouter({
  ad: adRouter,
  article: articleRouter,
  media: mediaRouter,
  topic: topicRouter,
  user: userRouter,
  userLink: userLinkRouter,
})

export type AppRouter = typeof appRouter

export const createCaller = createCallerFactory(appRouter)
