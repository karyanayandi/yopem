import { getSession } from "@/lib/auth/utils"

export default async function Home() {
  const { session } = await getSession()

  return (
    <main className="">
      <h1 className="my-2 text-2xl font-bold">Profile</h1>
      {session && (
        <pre className="my-2 rounded-lg bg-secondary p-4">
          {JSON.stringify(session, null, 2)}
        </pre>
      )}
    </main>
  )
}
