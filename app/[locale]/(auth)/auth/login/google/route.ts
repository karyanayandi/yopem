import { cookies } from "next/headers"
import { generateCodeVerifier, generateState } from "arctic"

import { googleOAuth } from "@/lib/auth"

export async function GET(): Promise<Response> {
  const state = generateState()
  const codeVerifier = generateCodeVerifier()

  const url = await googleOAuth.createAuthorizationURL(state, codeVerifier, {
    scopes: ["openid", "profile", "email"],
  })

  cookies().set("state", state, {
    path: "/",
    secure: process.env.APP_ENV === "production",
    httpOnly: true,
    maxAge: 60 * 10,
    sameSite: "lax",
  })

  cookies().set("code_verifier", codeVerifier, {
    path: "/",
    secure: process.env.APP_ENV === "production",
    httpOnly: true,
    maxAge: 60 * 10,
    sameSite: "lax",
  })

  return Response.redirect(url)
}
