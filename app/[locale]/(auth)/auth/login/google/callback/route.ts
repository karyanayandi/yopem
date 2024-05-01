import { cookies } from "next/headers"
import { OAuth2RequestError } from "arctic"

import { auth, googleOAuth } from "@/lib/auth"
import { db } from "@/lib/db"
import { accounts, users } from "@/lib/db/schema"
import { cuid, slugify, uniqueCharacter } from "@/lib/utils"

export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url)
  const code = url.searchParams.get("code")
  const state = url.searchParams.get("state")

  const storedState = cookies().get("state")?.value ?? null
  const storedCodeVerifier = cookies().get("code_verifier")?.value ?? null

  if (
    !code ||
    !state ||
    !storedState ||
    !storedCodeVerifier ||
    state !== storedState
  ) {
    return new Response("Invalid Request", {
      status: 400,
    })
  }

  try {
    const tokens = await googleOAuth.validateAuthorizationCode(
      code,
      storedCodeVerifier,
    )

    const googleUserResponse = await fetch(
      "https://openidconnect.googleapis.com/v1/userinfo",
      {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`,
        },
      },
    )

    const googleUser: GoogleUser = await googleUserResponse.json()

    const existingUser = await db.query.accounts.findFirst({
      where: (accounts, { and, eq }) =>
        and(
          eq(accounts.provider, "google"),
          eq(accounts.providerAccountId, googleUser.sub),
        ),
    })

    if (existingUser) {
      const session = await auth.createSession(existingUser.userId, {})
      const sessionCookie = auth.createSessionCookie(session.id)
      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes,
      )
      return new Response(null, {
        status: 302,
        headers: {
          Location: "/",
        },
      })
    }

    const userId = cuid()

    await db.batch([
      db.insert(users).values({
        id: userId,
        email: googleUser.email,
        name: googleUser.name,
        username: `${slugify(googleUser.name)}_${uniqueCharacter()}`,
        image: googleUser.picture,
      }),
      db.insert(accounts).values({
        provider: "google",
        providerAccountId: googleUser.sub,
        userId: userId,
      }),
    ])

    const session = await auth.createSession(userId, {})
    const sessionCookie = auth.createSessionCookie(session.id)
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    )
    return new Response(null, {
      status: 302,
      headers: {
        Location: "/",
      },
    })
  } catch (err) {
    console.log(err)
    if (err instanceof OAuth2RequestError) {
      return new Response(null, {
        status: 400,
      })
    }
    return new Response(null, {
      status: 500,
    })
  }
}

interface GoogleUser {
  sub: string
  email: string
  name: string
  picture: string
}
