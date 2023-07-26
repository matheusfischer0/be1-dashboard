'use client'

import React from 'react'
import { useVideos } from '@/hooks/useVideos'
import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Input } from '@/app/components/inputs.component'
import { useRouter } from 'next/navigation'
import { Button } from '@/app/components/buttons.component'

interface RegisterPageProps {
  params: {}
}
// Define the zod schema
const videoSchema = z.object({
  name: z.string(),
  description: z.string(),
})

type CreateVideoFormData = z.infer<typeof videoSchema>

export default function RegisterPage({ params }: RegisterPageProps) {
  const { createVideo, error } = useVideos()

  const router = useRouter()

  const methods = useForm<CreateVideoFormData>({
    resolver: zodResolver(videoSchema),
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = methods

  const onSubmit = (data: CreateVideoFormData) => {
    if (data.name) {
      createVideo(data) // You will need to adjust the createVideo function to handle FormData
    }
    router.push('/admin/configuracoes/videos')
  }

  if (error) return <div>An error has occurred: {error.message}</div>

  return (
    <div className="flex-1 items-center justify-center text-zinc-900">
      <div className="text-xl font-medium pb-4">Cadastrar Produto</div>
      <FormProvider {...methods}>
        <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex">
            <div className="flex flex-col flex-wrap gap-3">
              <Input.Root className="flex-1">
                <Input.Label>Nome:</Input.Label>
                <Input.Controller
                  className="w-full max-w-2xl"
                  register={register('name')}
                  type="text"
                />
                <Input.Error>
                  {errors.name && <p>{errors.name.message?.toString()}</p>}
                </Input.Error>
              </Input.Root>
              <Input.Root className="flex-1">
                <Input.Label>Descrição:</Input.Label>
                <Input.TextAreaController
                  className="w-full max-w-2xl"
                  register={register('description')}
                />
                <Input.Error>
                  {errors.name && <p>{errors.name.message?.toString()}</p>}
                </Input.Error>
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
