import { IFile } from './IFile'

export interface IProduct {
  id: string
  name: string
  smallDescription: string
  description?: string
  files?: IFile[]
  images?: IFile[]
  createdAt?: Date
}
