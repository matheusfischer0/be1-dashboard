'use client'

import React, { useCallback, useEffect } from 'react'
import { useProducts } from '@/hooks/useProducts'
import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z, ZodType } from 'zod'
import { Input } from '@/app/components/inputs.component'
import { useRouter } from 'next/navigation'
import { Button } from '@/app/components/buttons.component'
import { IFile } from '@/interfaces/IFile'
import { useFile } from '@/hooks/useFile'

interface RegisterPageProps {
  params: {}
}

// Define the zod schema
const productSchema = z.object({
  name: z.string().nonempty('O nome é obrigatório'),
  smallDescription: z.string().nonempty('A descrição curta é obrigatória').max(100, "Máximo de 100 caracteres"),
  description: z.string().nonempty('Uma descrição deve ser adicionada!'),
  images: z.any().optional() as ZodType<FileList | null>,
  files: z.any().optional() as ZodType<FileList | null>,
})

type CreateProductFormData = z.infer<typeof productSchema>

export default function RegisterPage({ params }: RegisterPageProps) {
  const { createProduct, error } = useProducts()

  const { uploadFiles, deleteFile, files } = useFile({
    filePath: 'produtos/files',
    fileType: 'DOCUMENT',
  })

  const { uploadFiles: uploadImages, deleteFile: deleteImage, files: images } = useFile({
    filePath: 'produtos/images',
    fileType: 'IMAGE',
  })

  const router = useRouter()

  const methods = useForm<CreateProductFormData>({
    resolver: zodResolver(productSchema),
    reValidateMode: "onSubmit"
  })

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    watch
  } = methods

  const selectedImages = watch('images')
  const selectedFiles = watch('files')

  const handleUploadImages = useCallback(async (imagesToUpload: FileList) => {
    await uploadImages(imagesToUpload);
    setValue('images', null)
  }, [uploadImages]);

  const handleUploadFiles = useCallback(async (filesToUpload: FileList) => {
    await uploadFiles(filesToUpload);
    setValue('files', null)
  }, [uploadFiles]);

  useEffect(() => {
    if (selectedImages) {
      handleUploadImages(selectedImages)
    }
  }, [selectedImages])

  useEffect(() => {
    if (selectedFiles) {
      handleUploadFiles(selectedFiles)
    }
  }, [selectedFiles])

  const onSubmit = (data: CreateProductFormData) => {
    if (data.name) {
      createProduct({ ...data, images, files }) // You will need to adjust the createProduct function to handle FormData
    }
    router.push('/admin/configuracoes/produtos')
  }

  const handleDeleteImage = (id: string) => {
    deleteImage(id)
  }
  const handleDeleteFile = (id: string) => {
    deleteFile(id)
  }

  if (error) return <div>An error has occurred: {error.message}</div>

  return (
    <div className="flex-1 items-center justify-center text-zinc-900">
      <div className="text-xl font-medium pb-4">Cadastrar Produto</div>
      <FormProvider {...methods}>
        <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex">
            <div className="flex flex-wrap gap-2">
              <Input.Root className="w-full md:flex-1">
                <Input.Label>Nome</Input.Label>
                <Input.Controller
                  register={register('name')}
                  type="text"
                />
                <Input.Error>
                  {errors.name && <p>{errors.name.message?.toString()}</p>}
                </Input.Error>
              </Input.Root>
              <Input.Root className="w-full md:flex-1">
                <Input.Label>Descrição Curta</Input.Label>
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
                <Input.Label>Descrição</Input.Label>
                <Input.TextAreaController
                  register={register('description')}
                />
                <Input.Error>
                  {errors.name && <p>{errors.name.message?.toString()}</p>}
                </Input.Error>
              </Input.Root>

              <Input.Root className="w-full lg:w-1/2 lg:flex-1">
                <Input.Label>Fotos do produto</Input.Label>
                <Input.FileController name="images" accept="image/*" multiple />
                <Input.Error>
                  {errors.images && <p>{errors.images.message?.toString()}</p>}
                </Input.Error>
                {images && (
                  <Input.ImagesPreview files={images} onDelete={(id) => handleDeleteImage(id)} />
                )}
              </Input.Root>
              <Input.Root className="w-full lg:w-1/2 lg:flex-1">
                <Input.Label>Arquivos (Visíveis para produtores e técnicos)</Input.Label>
                <Input.FileController name="files" accept=".pdf" multiple />
                <Input.Error>
                  {errors.files && <p>{errors.files.message?.toString()}</p>}
                </Input.Error>
                {files && (
                  <Input.FilesPreview files={files} onDelete={(id) => handleDeleteFile(id)} />
                )}
              </Input.Root>

            </div>
          </div>

          <div className="flex py-4">
            <Button
              className={`bg-gradient-to-r from-blue-600 to-blue-400 rounded-md px-4 text-white w-36 justify-center`}
              type="submit"
            >
              Salvar
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  )
}
