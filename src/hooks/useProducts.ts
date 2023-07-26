import { useMutation, useQuery, useQueryClient } from 'react-query'
import useAxiosAuth from './useAxiosAuth'
import { IProduct } from '@/interfaces/IProduct'

export const useProducts = () => {
  const http = useAxiosAuth()
  const queryClient = useQueryClient()

  const getProducts = async (): Promise<IProduct[]> => {
    const { data } = await http.post('/products')
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
    data: products,
    isLoading,
    error,
    refetch: refetchProducts,
    isRefetching,
  } = useQuery<IProduct[], Error>('products', getProducts)

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
    products,
    isLoading: isLoading || isRefetching,
    error,
    refetchProducts,
    createProduct: mutationCreate.mutate,
    updateProduct: mutationUpdate.mutate,
    deleteProduct: mutationDelete.mutate,
  }
}
