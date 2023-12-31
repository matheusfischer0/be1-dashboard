'use client'

import React, { useCallback, useEffect } from 'react'
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
import Loading from '@/app/components/loading.component'

interface EditPageProps {
  params: { id: string }
}

// Define the zod schema
const videoSchema = z.object({
  name: z.string().nonempty('O nome não pode ser vazio!'),
  description: z.string().nonempty('Uma descrição deve ser adicionada!'),
  videoUrl: z.string().optional().nullable(),
  file: z.any().optional() as ZodType<FileList | null>
})

type EditVideoFormData = z.infer<typeof videoSchema>

export default function EditPage({ params }: EditPageProps) {
  const { video, updateVideo, error } =
    useVideo(params.id)

  const { files: file, uploadFiles: uploadVideos, deleteFile: deleteVideo, isLoading: isLoadingFile, setInitialFiles } = useFile({
    videoId: video?.id,
    fileType: 'VIDEO',
  })

  const router = useRouter()

  const methods = useForm<EditVideoFormData>({
    resolver: zodResolver(videoSchema),
    reValidateMode: 'onSubmit',
  })

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    watch,
  } = methods

  const selectedVideo = watch('file')

  const handleUploadVideos = useCallback(async (videosToUpload: FileList) => {
    await uploadVideos(videosToUpload);
    setValue('file', null)
  }, []);

  useEffect(() => {
    if (selectedVideo) {
      handleUploadVideos(selectedVideo)
    }
  }, [selectedVideo])

  useEffect(() => {
    if (video) {
      setValue('name', video.name)
      setValue(
        'description',
        video.description ? video.description : '',
      )
      setValue(
        'videoUrl',
        video.videoUrl,
      )
      if (video?.file)
        setInitialFiles([video?.file])
    }
  }, [video])

  if (error) return <div>An error has occurred: {error.message}</div>

  const onSubmit = (data: EditVideoFormData) => {
    console.log("Video: ", data)
    if (data.name) {
      updateVideo({
        id: params.id,
        name: data.name,
        description: data.description,
        videoUrl: data.videoUrl,
        file: file ? file[0] : undefined,
      })
    }
    router.push('/admin/configuracoes/videos')
  }

  function handleDeleteVideo(id: string) {
    deleteVideo(id)
  }

  const shouldRenderYoutubeLink = (file?.length === 0 || !file)

  const isLoadingVideo = (file && file.length === 0 || isLoadingFile)

  return (
    <div className="flex-1 items-center justify-center text-zinc-900">
      <div className="pb-2 text-xl font-bold">Editar Video</div>
      <FormProvider {...methods}>
        <form
          className="w-full flex flex-col"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="">
            <div className="flex flex-col lg:flex-row gap-3 py-4">
              <div className="flex-1">
                <Input.Root className="w-full">
                  <Input.Label>Nome:</Input.Label>
                  <Input.Controller
                    register={register('name')}
                    type="text"
                  />
                  <Input.Error>
                    {errors.name && <p>{errors.name.message?.toString()}</p>}
                  </Input.Error>
                </Input.Root>
                <Input.Root className="w-full mt-2">
                  <Input.Label>Descrição:</Input.Label>
                  <Input.TextAreaController register={register('description')} />
                  <Input.Error>
                    {errors.description && (
                      <p>{errors.description.message?.toString()}</p>
                    )}
                  </Input.Error>
                </Input.Root>
              </div>

              <div className='flex-1'>
                {shouldRenderYoutubeLink && <Input.Root className="w-full">
                  <div className='flex'>
                    <div className='flex-1'>
                      <Input.Label className=''>Link do video (Youtube)</Input.Label>
                      <Input.Controller
                        register={register('videoUrl')}
                        placeholder='Link video Youtube'
                        type="text"
                      />
                    </div>
                  </div>
                  <Input.Error>
                    {errors.videoUrl && (
                      <p>{errors.videoUrl.message?.toString()}</p>
                    )}
                  </Input.Error>
                </Input.Root>}

                <Input.Root className="w-full">
                  <Input.Label>Adicione um arquivo de video (.mp4)</Input.Label>
                  <div className='flex items-center'>
                    <div className='flex-1'>
                      <Input.FileController name="file" accept=".mp4" />
                    </div>
                  </div>
                  <Input.Error>
                    {errors.file && <p>{errors.file.message?.toString()}</p>}
                  </Input.Error>
                </Input.Root>
                {isLoadingVideo && (
                  <Loading />
                )}
                {file && file?.length > 0 && (
                  <>
                    <Input.Label className='mt-4'>Video Selecionado</Input.Label>
                    <Input.VideoPreview files={file} onDelete={(id) => handleDeleteVideo(id)} />
                  </>
                )}
              </div>
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
