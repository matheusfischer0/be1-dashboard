'use client'

import React, { useEffect } from 'react'
import { z } from 'zod'
import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/app/components/inputs.component'
import { Button } from '@/app/components/buttons.component'
import { useFile } from '@/hooks/useFile'
import { IContact } from '@/interfaces/IContact'
import Image from 'next/image'
import { FiTrash } from 'react-icons/fi'
import { useRouter } from 'next/navigation'
import { useContact } from '@/hooks/useContact'

interface EditPageProps {
  params: { id: string }
}

// Define the zod schema
const Contactschema = z.object({
  type: z.string(),
  category: z.string(),
  contact: z.string(),
})

const DEFAULT_TYPES = [{ value: 'E-mail', label: "E-mail" }, { value: 'Telefone', label: "Telefone" }]
const DEFAULT_MASKS = [{ label: "E-mail", mask: "" }, { label: "Telefone", mask: "(99) 99999-9999" }]

type EditContactFormData = z.infer<typeof Contactschema>

export default function EditPage({ params }: EditPageProps) {
  const { contact, updateContact, refetchContact, isLoading, error } =
    useContact(params.id)

  const router = useRouter()

  const methods = useForm<EditContactFormData>({
    resolver: zodResolver(Contactschema),
    reValidateMode: 'onChange',
  })

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    watch,
  } = methods

  useEffect(() => {
    if (contact) {
      setValue('type', contact.type)
      setValue('category', contact.category)
      setValue('contact', contact.contact)
    }
  }, [contact, params, setValue])

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>An error has occurred: {error.message}</div>

  const onSubmit = (data: EditContactFormData) => {
    if (data.contact) {
      updateContact({ id: params.id, ...data })
    }
    router.push('/admin/configuracoes/contatos')
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
                <Input.Label>Tipo de contato:</Input.Label>
                <Input.SelectController
                  name='type'
                  options={DEFAULT_TYPES}
                />
                <Input.Error>
                  {errors.type && <p>{errors.type.message?.toString()}</p>}
                </Input.Error>
              </Input.Root>
              <Input.Root className="flex-1 min-w-[500px]">
                <Input.Label>Setor:</Input.Label>
                <Input.Controller
                  register={register('category')}
                  type="text"
                />
                <Input.Error>
                  {errors.category && <p>{errors.category.message?.toString()}</p>}
                </Input.Error>
              </Input.Root>
              <Input.Root className="flex-1 min-w-[500px]">
                <Input.Label>Contato:</Input.Label>
                <Input.Controller
                  register={register('contact')}
                  type="text"
                />
                <Input.Error>
                  {errors.contact && <p>{errors.contact.message?.toString()}</p>}
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
