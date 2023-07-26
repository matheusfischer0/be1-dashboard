
export interface IUpdateUserDTO {
  name: string
  email: string
  avatarUrl?: string
  cpf?: string
  state: string
  city: string
  phone?: string
  role: 'ADMIN' | 'USER'
  password?: string
}