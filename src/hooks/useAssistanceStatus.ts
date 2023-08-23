import { useMutation, useQuery, useQueryClient } from 'react-query'
import useAxiosAuth from './useAxiosAuth'
import { IAssistance } from '@/interfaces/IAssistance'
import { IStatus } from '@/interfaces/IStatus'

export const useAssistanceStatus = () => {
  const http = useAxiosAuth()
  const queryClient = useQueryClient()

  const getStatus = async (): Promise<IStatus[]> => {
    const { data } = await http.get(`/assistances/status`)
    console.log(data)
    return data
  }

  const {
    data: status,
    isLoading: isLoadingStatus,
    error: errorStatus,
  } = useQuery<IStatus[], Error>('status', getStatus)


  return {
    status,
    isLoading: isLoadingStatus,
    error: errorStatus,
  }
}
