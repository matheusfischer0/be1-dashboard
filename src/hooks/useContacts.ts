import { useMutation, useQuery, useQueryClient } from 'react-query'
import useAxiosAuth from './useAxiosAuth'
import { IContact } from '@/interfaces/IContact'

export const useContacts = () => {
  const http = useAxiosAuth()
  const queryClient = useQueryClient()

  const getContacts = async (): Promise<IContact[]> => {
    const { data } = await http.post('/contacts')
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
    data: contacts,
    isLoading,
    error,
    refetch: refetchContacts,
    isRefetching,
  } = useQuery<IContact[], Error>('contacts', getContacts)

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
    contacts,
    isLoading: isLoading || isRefetching,
    error,
    refetchContacts,
    createContact: mutationCreate.mutate,
    updateContact: mutationUpdate.mutate,
    deleteContact: mutationDelete.mutate,
  }
}
