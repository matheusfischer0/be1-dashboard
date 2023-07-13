import { DefaultSession } from "next-auth"
import { IUser } from "./IUser"

export interface ISession extends DefaultSession {
  id?: string
  user: IUser
  token: string,
  refreshToken: string
  tokenExpiry: number
}