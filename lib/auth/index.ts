import { DrizzleSQLiteAdapter } from "@lucia-auth/adapter-drizzle"
import { Google } from "arctic"
import { Lucia } from "lucia"

import env from "@/env.mjs"
import { initializeDB } from "@/lib/db"
import { sessions, users } from "@/lib/db/schema"
import type { UserRole } from "@/lib/validation/user"

const adapter = new DrizzleSQLiteAdapter(initializeDB, sessions, users)

export const auth = new Lucia(adapter, {
  sessionCookie: {
    expires: false,
    attributes: {
      secure: process.env.APP_ENV === "production",
    },
  },
  getUserAttributes: (attributes) => {
    return {
      name: attributes.name,
      username: attributes.username,
      email: attributes.email,
      image: attributes.image,
      phoneNumber: attributes.phoneNumber,
      about: attributes.about,
      role: attributes.role,
    }
  },
})

export const googleOAuth = new Google(
  env.GOOGLE_CLIENT_ID,
  env.GOOGLE_CLIENT_SECRET,
  env.GOOGLE_REDIRECT_URL,
)

declare module "lucia" {
  interface Register {
    Lucia: typeof auth
    DatabaseUserAttributes: DatabaseUserAttributes
  }
}

interface DatabaseUserAttributes {
  name: string
  username: string
  email: string
  image: string
  phoneNumber: string
  about: string
  role: UserRole
}
