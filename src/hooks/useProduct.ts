import { useMutation, useQuery, useQueryClient } from 'react-query'
import useAxiosAuth from './useAxiosAuth'
import { IProduct } from '@/interfaces/IProduct'

export const useProduct = (productId: string) => {
  const http = useAxiosAuth()
  const queryClient = useQueryClient()

  const getProduct = async (id: string): Promise<IProduct> => {
    const { data } = await http.get(`/products/${id}`)
    return data
  }

  const createProduct = async (
    newProduct: Partial<IProduct>,
  ): Promise<IProduct> => {
    const { data } = await http.post('/products/create', newProduct)
    return data
  }

  const updateProduct = async (product: IProduct): Promise<IProduct> => {
    const { data } = await http.post(
      `/products/update/${product.id}`,
      product,
    )
    return data
  }

  const deleteProduct = async (id: string): Promise<void> => {
    await http.delete(`/products/${id}`)
  }

  const {
    data: product,
    isLoading,
    error,
    refetch: refetchProduct,
    isRefetching,
  } = useQuery<IProduct, Error, IProduct, [string, string]>(
    ['product', productId],
    ({ queryKey }) => {
      return getProduct(queryKey[1])
    },
  )

  const mutationCreate = useMutation<IProduct, Error, Partial<IProduct>>(
    createProduct,
    {
      onSuccess: () => {
        queryClient.invalidateQueries('products')
      },
    },
  )

  const mutationUpdate = useMutation<IProduct, Error, IProduct>(updateProduct, {
    onSuccess: () => {
      queryClient.invalidateQueries('products')
    },
  })

  const mutationDelete = useMutation<void, Error, string>(deleteProduct, {
    onSuccess: () => {
      queryClient.invalidateQueries('products')
    },
  })

  return {
    product,
    isLoading: isLoading || isRefetching,
    error,
    refetchProduct,
    createProduct: mutationCreate.mutate,
    updateProduct: mutationUpdate.mutate,
    deleteProduct: mutationDelete.mutate,
  }
}
