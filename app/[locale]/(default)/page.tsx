import { getSession } from "@/lib/auth/utils"
import { api } from "@/lib/trpc/server"

export default async function Home() {
  const { session } = await getSession()

  const topics = await api.topic.byArticleCount({
    language: "id",
    page: 1,
    perPage: 10,
  })

  return (
    <main className="">
      <h1 className="my-2 text-2xl font-bold">Profile</h1>
      {session && (
        <pre className="my-2 rounded-lg bg-secondary p-4">
          {JSON.stringify(session, null, 2)}
        </pre>
      )}
      <pre className="my-2 rounded-lg bg-secondary p-4">
        {JSON.stringify(topics, null, 2)}
      </pre>
    </main>
  )
}
