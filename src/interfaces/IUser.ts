import { DefaultUser } from "next-auth"

export interface IUser extends DefaultUser {
  id: string
  name: string
  email: string
  avatarUrl: string
  cpf: string
  state: string
  city: string
  phone: string
  role: 'ADMIN' | 'USER'
  password?: string
}