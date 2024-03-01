import { mediaRouter } from "./routes/media"
import { topicRouter } from "./routes/topic"
import { userRouter } from "./routes/user"
import { userLinkRouter } from "./routes/user-link"
import { createTRPCRouter } from "./trpc"

export const appRouter = createTRPCRouter({
  media: mediaRouter,
  topic: topicRouter,
  user: userRouter,
  userLink: userLinkRouter,
})

export type AppRouter = typeof appRouter
