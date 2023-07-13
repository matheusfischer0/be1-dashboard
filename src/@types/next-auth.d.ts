import { ISession } from "@/interfaces/ISession"
import { IUser } from "@/interfaces/IUser"
import NextAuth, { DefaultSession } from "next-auth"

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  export interface User extends IUser {
  }

  export interface Session extends ISession {
    user: User
    token: string,
    refreshToken: string
    tokenExpiry: number
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    user: User
  }
}