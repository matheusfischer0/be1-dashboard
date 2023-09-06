'use client'

import React, { useEffect } from 'react'
import { z } from 'zod'
import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/app/components/inputs.component'
import { Button } from '@/app/components/buttons.component'
import { useFile } from '@/hooks/useFile'
import { IAssistance } from '@/interfaces/IAssistance'
import Image from 'next/image'
import { FiTrash } from 'react-icons/fi'
import { useRouter } from 'next/navigation'
import { useAssistance } from '@/hooks/useAssistance'
import { useAssistanceStatus } from '@/hooks/useAssistanceStatus'


interface EditPageProps {
  params: { id: string }
}

// Define the zod schema
const Assistanceschema = z.object({
  title: z.string(),
  description: z.string(),
  status: z.string()
})

type EditAssistanceFormData = z.infer<typeof Assistanceschema>

export default function EditPage({ params }: EditPageProps) {
  const { status } = useAssistanceStatus()
  const { assistance, updateAssistance, refetchAssistance, isLoading, error } =
    useAssistance(params.id)

  const router = useRouter()

  const methods = useForm<EditAssistanceFormData>({
    resolver: zodResolver(Assistanceschema),
    reValidateMode: 'onChange',
  })

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = methods

  useEffect(() => {
    if (assistance) {
      setValue('title', assistance.title)
      setValue('description', assistance.description)

      const activeStatus = status?.find(item => item.label === assistance.status)?.value
      if (activeStatus) {
        setValue('status', activeStatus)
      }
    }
  }, [assistance, status, params, setValue])

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>An error has occurred: {error.message}</div>

  const onSubmit = (data: EditAssistanceFormData) => {
    if (data.title) {
      updateAssistance({ id: params.id, ...data })
      refetchAssistance()
    }
    router.push('/admin/chamados')
  }

  return (
    <div className="flex-1 items-center justify-center text-zinc-900">
      <div className="pb-2 text-xl font-bold">Editar Contato</div>
      <FormProvider {...methods}>
        <form
          className="w-full flex flex-col"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="flex">
            <div className="flex flex-wrap gap-3">
              <Input.Root className="flex-1 min-w-[500px]">
                <Input.Label>Title</Input.Label>
                <Input.Controller
                  register={register('title')}
                  type="text"
                />
                <Input.Error>
                  {errors.title && <p>{errors.title.message?.toString()}</p>}
                </Input.Error>
              </Input.Root>
              <Input.Root className="flex-1 min-w-[500px]">
                <Input.Label>Descrição</Input.Label>
                <Input.Controller
                  register={register('description')}
                  type="text"
                />
                <Input.Error>
                  {errors.description && <p>{errors.description.message?.toString()}</p>}
                </Input.Error>
              </Input.Root>
              <Input.Root className="flex-1 min-w-[500px]">
                <Input.Label>Status</Input.Label>
                <Input.SelectController
                  name='status'
                  options={status}
                />
                <Input.Error>
                  {errors.status && <p>{errors.status.message?.toString()}</p>}
                </Input.Error>
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
    </div>
  )
}
