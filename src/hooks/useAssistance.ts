import { useMutation, useQuery, useQueryClient } from 'react-query'
import useAxiosAuth from './useAxiosAuth'
import { IAssistance } from '@/interfaces/IAssistance'
import { IStatus } from '@/interfaces/IStatus'

export const useAssistance = (assistanceId: string) => {
  const http = useAxiosAuth()
  const queryClient = useQueryClient()

  const getAssistance = async (id: string): Promise<IAssistance> => {
    const { data } = await http.get(`/assistances/${assistanceId}`)
    return data
  }

  const getStatus = async (): Promise<IStatus[]> => {
    const { data } = await http.get(`/assistances/status`)
    return data
  }

  const createAssistance = async (
    newAssistance: Partial<IAssistance>,
  ): Promise<IAssistance> => {
    const { data } = await http.post('/assistances/create', newAssistance)
    return data
  }

  const updateAssistance = async (assistance: Partial<IAssistance>): Promise<IAssistance> => {
    const { data } = await http.post(
      `/assistances/update/${assistance.id}`,
      assistance,
    )
    return data
  }

  const deleteAssistance = async (id: string): Promise<void> => {
    await http.delete(`/assistances/${id}`)
  }

  const {
    data: assistance,
    isLoading,
    error,
    refetch: refetchAssistance,
    isRefetching,
  } = useQuery<IAssistance, Error, IAssistance, [string, string]>(
    ['assistance', assistanceId],
    ({ queryKey }) => {
      return getAssistance(queryKey[1])
    },
  )

  const {
    data: status,
    isLoading: isLoadingStatus,
    error: errorStatus,
  } = useQuery<IStatus[], Error>('status', getStatus)

  const mutationCreate = useMutation<IAssistance, Error, Partial<IAssistance>>(
    createAssistance,
    {
      onSuccess: () => {
        queryClient.invalidateQueries('assistances')
      },
    },
  )

  const mutationUpdate = useMutation<IAssistance, Error, IAssistance>(updateAssistance, {
    onSuccess: () => {
      queryClient.invalidateQueries('assistances')
    },
  })

  const mutationDelete = useMutation<void, Error, string>(deleteAssistance, {
    onSuccess: () => {
      queryClient.invalidateQueries('assistances')
    },
  })

  return {
    assistance,
    status,
    isLoading: isLoading || isRefetching,
    error,
    refetchAssistance,
    createAssistance: mutationCreate.mutate,
    updateAssistance: mutationUpdate.mutate,
    deleteAssistance: mutationDelete.mutate,
  }
}
