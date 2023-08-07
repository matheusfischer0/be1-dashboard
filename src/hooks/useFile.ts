import { useState } from 'react'
import { AxiosError } from 'axios'
import { http } from '@/lib/http-common'
import { IFile } from '@/interfaces/IFile'

interface UseUploadFileProps {
  filePath: string,
  fileType: string,
  productId?: string,
  videoId?: string
}

interface UseUploadFileResult {
  files?: IFile[]
  isLoading: boolean
  error: AxiosError | null
  uploadFiles: (files: FileList) => Promise<void>
  deleteFile: (id: string) => Promise<void>
  setInitialFiles: (initialFiles: IFile[]) => void
}

export const useFile = ({
  filePath,
  fileType,
  productId,
  videoId
}: UseUploadFileProps): UseUploadFileResult => {
  const [error, setError] = useState<AxiosError | null>(null)
  const [files, setFiles] = useState<IFile[]>()
  const [isLoading, setIsLoading] = useState(false)

  const filePathEncoded = encodeURIComponent(filePath)

  const urlEncoded = `filePath=${filePathEncoded}&fileType=${fileType}${productId ? `&productId=${productId}` : ''}${videoId ? `&videoId=${videoId}` : ''}`

  const setInitialFiles = (initialFiles: IFile[]) => {
    setFiles(initialFiles)
  }

  const deleteFile = async (id: string) => {
    setIsLoading(true)
    try {
      await http.delete(`/files/${id}`)

      setFiles(prevState => {
        return prevState ? prevState.filter(item => item.id !== id) : []
      })

      setIsLoading(false)
    } catch (error: any) {
      setError(error)
      setIsLoading(false)
    }
  }

  const uploadFiles = async (filesToUpload: FileList) => {
    setIsLoading(true)
    setError(null)

    try {
      // Example upload using axios
      const formData = new FormData()

      const list = Array.from(filesToUpload)

      list.forEach((file) => {
        formData.append('files', file as Blob)
      })

      const { data: uploadedFiles } = await http.patch<IFile[]>(`/files?${urlEncoded}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      const newFiles = files ? [...files, ...uploadedFiles] : [...uploadedFiles]

      setFiles(newFiles)

      setIsLoading(false)
    } catch (error: any) {
      setError(error)
      setIsLoading(false)
    }
  }

  return { files, isLoading, error, uploadFiles, deleteFile, setInitialFiles }
}
