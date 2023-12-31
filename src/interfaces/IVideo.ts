import { IFile } from './IFile'

export interface IVideo {
  id: string
  name: string
  description?: string
  videoUrl?: string | null
  file?: IFile
  createdAt?: Date
}
