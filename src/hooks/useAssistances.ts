import { useMutation, useQuery, useQueryClient } from 'react-query'
import useAxiosAuth from './useAxiosAuth'
import { IAssistance } from '@/interfaces/IAssistance'

export const useAssistances = () => {
  const http = useAxiosAuth()
  const queryClient = useQueryClient()

  const getAssistances = async (): Promise<IAssistance[]> => {
    const { data } = await http.post('/assistances/all')
    return data
  }

  const createAssistance = async (
    newAssistance: Partial<IAssistance>,
  ): Promise<IAssistance> => {
    console.log(newAssistance)
    const { data } = await http.post('/assistances/create', newAssistance)
    return data
  }

  const updateAssistance = async (assistance: IAssistance): Promise<IAssistance> => {
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
    data: assistances,
    isLoading,
    error,
    refetch: refetchAssistances,
    isRefetching,
  } = useQuery<IAssistance[], Error>('assistances', getAssistances)

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
    assistances,
    isLoading: isLoading || isRefetching,
    error,
    refetchAssistances,
    createAssistance: mutationCreate.mutate,
    updateAssistance: mutationUpdate.mutate,
    deleteAssistance: mutationDelete.mutate,
  }
}
