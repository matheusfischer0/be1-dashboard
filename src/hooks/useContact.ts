import { useMutation, useQuery, useQueryClient } from 'react-query'
import useAxiosAuth from './useAxiosAuth'
import { IContact } from '@/interfaces/IContact'

export const useContact = (contactId: string) => {
  const http = useAxiosAuth()
  const queryClient = useQueryClient()

  const getContact = async (id: string): Promise<IContact> => {
    const { data } = await http.get(`/contacts/${contactId}`)
    return data
  }

  const createContact = async (
    newContact: Partial<IContact>,
  ): Promise<IContact> => {
    const { data } = await http.post('/contacts/create', newContact)
    return data
  }

  const updateContact = async (contact: IContact): Promise<IContact> => {
    const { data } = await http.post(
      `/contacts/update/${contact.id}`,
      contact,
    )
    return data
  }

  const deleteContact = async (id: string): Promise<void> => {
    await http.delete(`/contacts/${id}`)
  }

  const {
    data: contact,
    isLoading,
    error,
    refetch: refetchContact,
    isRefetching,
  } = useQuery<IContact, Error, IContact, [string, string]>(
    ['contact', contactId],
    ({ queryKey }) => {
      return getContact(queryKey[1])
    },
  )

  const mutationCreate = useMutation<IContact, Error, Partial<IContact>>(
    createContact,
    {
      onSuccess: () => {
        queryClient.invalidateQueries('contacts')
      },
    },
  )

  const mutationUpdate = useMutation<IContact, Error, IContact>(updateContact, {
    onSuccess: () => {
      queryClient.invalidateQueries('contacts')
    },
  })

  const mutationDelete = useMutation<void, Error, string>(deleteContact, {
    onSuccess: () => {
      queryClient.invalidateQueries('contacts')
    },
  })

  return {
    contact,
    isLoading: isLoading || isRefetching,
    error,
    refetchContact,
    createContact: mutationCreate.mutate,
    updateContact: mutationUpdate.mutate,
    deleteContact: mutationDelete.mutate,
  }
}
