'use client'

import React, { useCallback, useEffect } from 'react'
import { z, ZodType } from 'zod'
import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/app/components/inputs.component'
import { Button } from '@/app/components/buttons.component'
import { useFile } from '@/hooks/useFile'
import { IProduct } from '@/interfaces/IProduct'
import Image from 'next/image'
import { FiTrash } from 'react-icons/fi'
import { useRouter } from 'next/navigation'
import { useProduct } from '@/hooks/useProduct'

interface EditPageProps {
  params: { id: string }
}

// Define the zod schema
const productSchema = z.object({
  name: z.string().nonempty('O nome não pode ser vazio!'),
  smallDescription: z
    .string()
    .nonempty('Uma breve descrição deve ser adicionada!'),
  description: z.string().nonempty('Uma descrição deve ser adicionada!'),
  images: z.any().optional().nullable() as ZodType<FileList>,
  files: z.any().optional().nullable() as ZodType<FileList>,
})

type EditProductFormData = z.infer<typeof productSchema>

export default function EditPage({ params }: EditPageProps) {
  const { product, updateProduct, refetchProduct, isLoading, error } =
    useProduct(params.id)

  const { files: images, uploadFiles: uploadImages, deleteFile: deleteImage, setInitialFiles: setInitialImages } = useFile({
    queryString: `?productId=${product?.id}&filePath=produtos/images`,
  })

  const router = useRouter()

  const methods = useForm<EditProductFormData>({
    resolver: zodResolver(productSchema),
    reValidateMode: 'onChange',
  })

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    watch,
  } = methods

  const selectedImages = watch('images')

  const handleUploadImages = useCallback(async (imagesToUpload: FileList) => {
    await uploadImages(imagesToUpload);
  }, [uploadImages]);

  useEffect(() => {
    if (selectedImages) {
      handleUploadImages(selectedImages)
      setValue('images', null)
    }
  }, [selectedImages])

  useEffect(() => {
    if (product) {
      setValue('name', product.name)
      setValue('smallDescription', product.smallDescription)
      setValue(
        'description',
        product.description ? product.description : '',
      )

      const productImages = product.files?.filter(file => file.fileName?.split('.')[1] === 'jpg' || 'jpeg' || 'png')
      if (productImages) setInitialImages(productImages)

      // const productFiles = product.files?.filter(file => file.fileType !== 'IMAGE')
      // if (productFiles) setInitialFiles(productFiles)
    }
  }, [product, params, setValue])

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>An error has occurred: {error.message}</div>

  const onSubmit = (data: EditProductFormData) => {
    if (data.name) {
      updateProduct({
        id: params.id,
        name: data.name,
        smallDescription: data.smallDescription,
        description: data.description,
        images,
      })
    }
    router.push('/admin/configuracoes/produtos')
  }

  function handleDeleteImage(id: string) {
    deleteImage(id)
  }

  return (
    <div className="flex-1 items-center justify-center text-zinc-900">
      <div className="pb-2 text-xl font-bold">Editar Produto</div>
      <FormProvider {...methods}>
        <form
          className="w-full flex flex-col"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="">
            <div className="flex flex-wrap gap-3">
              <Input.Root className="flex-1 min-w-[500px]">
                <Input.Label>Nome:</Input.Label>
                <Input.Controller
                  register={register('name')}
                  type="text"
                />
                <Input.Error>
                  {errors.name && <p>{errors.name.message?.toString()}</p>}
                </Input.Error>
              </Input.Root>
              <Input.Root className="flex-1 min-w-[500px]">
                <Input.Label>Pequena Descrição:</Input.Label>
                <Input.Controller
                  register={register('smallDescription')}
                  type="text"
                />
                <Input.Error>
                  {errors.smallDescription && (
                    <p>{errors.smallDescription.message?.toString()}</p>
                  )}
                </Input.Error>
              </Input.Root>
              <Input.Root className="w-full">
                <Input.Label>Descrição:</Input.Label>
                <Input.TextAreaController
                  register={register('description')}
                />
                <Input.Error>
                  {errors.name && <p>{errors.name.message?.toString()}</p>}
                </Input.Error>
              </Input.Root>
            </div>
            <div className="flex-1">
              <Input.Root className="max-w-2xl">
                <Input.Label>Adicione novas images:</Input.Label>
                <Input.FileController name="images" accept="image/*" multiple />
                <Input.Error>
                  {errors.images && <p>{errors.images.message?.toString()}</p>}
                </Input.Error>
                {images && (
                  <>
                    <Input.Label className="pt-4">Imagens:</Input.Label>
                    <Input.ImagesPreview files={images} onDelete={(id) => handleDeleteImage(id)} />
                  </>
                )}
              </Input.Root>

            </div>
          </div>

          <div className="py-4">
            <Button
              className={`bg-gradient-to-r from-blue-600 to-blue-400 rounded-md px-4 text-white w-36 justify-center`}
              type="submit"
            >
              Salvar
            </Button>
          </div>
        </form>
      </FormProvider>
    </div >
  )
}
