export interface IFile extends File {
  id: string
  productId?: string
  fileName?: string
  originalName?: string
  fileType?: 'IMAGE' | 'PDF' | 'VIDEO'
  filePath?: string
  uri?: string
  createdAt?: string
}
