'use client'

import React, { useEffect } from 'react'
import { z, ZodType } from 'zod'
import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/app/components/inputs.component'
import { Button } from '@/app/components/buttons.component'
import { useFile } from '@/hooks/useFile'
import Image from 'next/image'
import { FiCornerDownRight, FiCornerUpRight, FiTrash, } from 'react-icons/fi'
import { useRouter } from 'next/navigation'
import { useVideo } from '@/hooks/useVideo'

interface EditPageProps {
  params: { id: string }
}

// Define the zod schema
const videoSchema = z.object({
  name: z.string().nonempty('O nome não pode ser vazio!'),
  description: z.string().nonempty('Uma descrição deve ser adicionada!'),
  videoUrl: z.string(),
  file: z.instanceof(FileList),
})

type EditVideoFormData = z.infer<typeof videoSchema>

export default function EditPage({ params }: EditPageProps) {
  const { video, updateVideo, refetchVideo, isLoading, error } =
    useVideo(params.id)

  const { uploadFiles, deleteFile } = useFile({
    queryString: `?videoId=${video?.id}`,
  })

  const router = useRouter()

  const methods = useForm<EditVideoFormData>({
    resolver: zodResolver(videoSchema),
    reValidateMode: 'onChange',
  })

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    watch,
  } = methods

  const selectedFile = watch('file')

  useEffect(() => {
    console.log("here:", selectedFile)
    // uploadFiles(selectedFile)
    // refetchVideo()
  }, [selectedFile])

  useEffect(() => {
    if (video) {
      setValue('name', video.name)
      setValue(
        'description',
        video.description ? video.description : '',
      )
      setValue(
        'videoUrl',
        video.videoUrl ? video.videoUrl : '',
      )
    }
  }, [video, params, setValue])

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>An error has occurred: {error.message}</div>

  const onSubmit = (data: EditVideoFormData) => {
    if (data.name) {
      updateVideo({
        id: params.id,
        name: data.name,
        description: data.description,
        videoUrl: data.videoUrl,
      })
    }
    router.push('/admin/configuracoes/videos')
  }

  function handleDeleteFile(id: string) {
    deleteFile(id)
  }

  return (
    <div className="flex-1 items-center justify-center text-zinc-900">
      <div className="pb-2 text-xl font-bold">Editar Video</div>
      <FormProvider {...methods}>
        <form
          className="w-full flex flex-col"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="">
            <div className="flex flex-col gap-3 py-4">
              <Input.Root className="w-full max-w-[750px]">
                <Input.Label>Nome:</Input.Label>
                <Input.Controller
                  register={register('name')}
                  type="text"
                />
                <Input.Error>
                  {errors.name && <p>{errors.name.message?.toString()}</p>}
                </Input.Error>
              </Input.Root>
              <Input.Root className="w-full max-w-[750px]">
                <Input.Label>Descrição:</Input.Label>
                <Input.TextAreaController register={register('description')} />
                <Input.Error>
                  {errors.description && (
                    <p>{errors.description.message?.toString()}</p>
                  )}
                </Input.Error>
              </Input.Root>

              <div className='flex'>
                <div className='flex-1'>
                  <Input.Root className="w-full max-w-[750px]">
                    <Input.Label>Adicione um video ou Link do Youtube:</Input.Label>
                    <div className='flex items-center'>
                      <FiCornerUpRight size={24} className="text-zinc-300" />
                      <div className='flex-1'>
                        <Input.FileController name="file" accept="video/*" multiple />
                      </div>
                    </div>
                    <Input.Error>
                      {errors.file && <p>{errors.file.message?.toString()}</p>}
                    </Input.Error>
                  </Input.Root>
                  <Input.Root className="w-full max-w-[750px]">
                    <div className='flex'>
                      <FiCornerDownRight size={24} className="text-zinc-300" />
                      <div className='flex-1'>
                        <Input.Controller
                          register={register('videoUrl')}
                          type="text"
                        />
                      </div>
                    </div>
                    <Input.Error>
                      {errors.videoUrl && (
                        <p>{errors.videoUrl.message?.toString()}</p>
                      )}
                    </Input.Error>
                  </Input.Root>
                </div>

              </div>

              {video?.file && (
                <div className="relative inline-block">
                  <Button
                    onClick={() => {
                      video?.file?.id &&
                        handleDeleteFile(video?.file?.id)
                    }}
                  >
                    <FiTrash size={24} className="text-red-600" />
                  </Button>
                  {video?.file.uri && (
                    <Image
                      src={video?.file.uri}
                      alt={`Video file ${video?.file?.uri}`}
                      className="rounded-md mr-2"
                      width={200}
                      height={200}
                    />
                  )}
                </div>
              )}
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
    </div>
  )
}
