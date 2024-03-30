"use server"

import { cache } from "react"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { type Session, type User } from "lucia"

import { auth } from "./index"

export interface AuthSession {
  session: {
    user: {
      id: string
      name: string
      username: string
      email: string
      image?: string
      phoneNumber?: string
      about?: string
      role: string
    }
  } | null
}

export const uncachedValidateRequest = async (): Promise<
  { user: User; session: Session } | { user: null; session: null }
> => {
  const sessionId = cookies().get(auth.sessionCookieName)?.value ?? null

  if (!sessionId) {
    return { user: null, session: null }
  }

  const result = await auth.validateSession(sessionId)
  try {
    if (result?.session?.fresh) {
      const sessionCookie = auth.createSessionCookie(result.session.id)
      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes,
      )
    }
    if (!result.session) {
      const sessionCookie = auth.createBlankSessionCookie()
      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes,
      )
    }
  } catch {
    console.error("Failed to set session cookie")
  }
  return result
}

const validateRequest = cache(uncachedValidateRequest)

export async function logout() {
  const { session } = await validateRequest()
  if (!session) {
    return {
      error: "Unauthorized",
    }
  }

  await auth.invalidateSession(session.id)

  const sessionCookie = auth.createBlankSessionCookie()
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  )
  return redirect("/auth/login")
}

export const getSession = async (): Promise<AuthSession> => {
  const { user, session } = await validateRequest()

  if (!session) return { session: null }

  return {
    session: {
      user: {
        id: user?.id,
        name: user?.name,
        username: user?.username,
        email: user?.email,
        image: user?.image,
        phoneNumber: user?.phoneNumber,
        about: user?.about,
        role: user?.role,
      },
    },
  }
}

export const checkSession = async () => {
  const { session } = await validateRequest()

  if (!session) redirect("/auth/login")
}
