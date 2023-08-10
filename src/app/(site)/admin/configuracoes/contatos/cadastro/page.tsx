'use client'

import React, { useCallback } from 'react'
import { useContacts } from '@/hooks/useContacts'
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
const Contactschema = z.object({
  type: z.string(),
  category: z.string(),
  contact: z.string(),
})

const DEFAULT_TYPES = [{ value: 'E-mail', label: "E-mail" }, { value: 'Telefone', label: "Telefone" }]

const DEFAULT_MASKS = [{ label: "E-mail", mask: "" }, { label: "Telefone", mask: "(99) 99999-9999" }]

type CreateContactFormData = z.infer<typeof Contactschema>

export default function RegisterPage({ params }: RegisterPageProps) {
  const { createContact, error } = useContacts()

  const router = useRouter()

  const methods = useForm<CreateContactFormData>({
    resolver: zodResolver(Contactschema),
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = methods

  const selectedType = watch('type')
  console.log(selectedType)

  const selectedMask = DEFAULT_MASKS.find(mask => mask.label === selectedType)?.mask ?? ''

  const onSubmit = async (data: CreateContactFormData) => {
    console.log(data)
    if (data.contact) {
      createContact(data) // You will need to adjust the createContact function to handle FormData
    }
  }

  if (error) return <div>An error has occurred: {error.message}</div>

  return (
    <div className="flex-1 items-center justify-center text-zinc-900">
      <div className="text-xl font-medium pb-4">Cadastrar Contato</div>
      <FormProvider {...methods}>
        <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex">
            <div className="flex flex-wrap w-full gap-2 max-w-2xl">
              <Input.Root className="w-full md:flex-1">
                <Input.Label>Tipo de contato:</Input.Label>
                <Input.SelectController
                  name='type'
                  options={DEFAULT_TYPES}
                />
                <Input.Error>
                  {errors.type && <p>{errors.type.message?.toString()}</p>}
                </Input.Error>
              </Input.Root>
              <Input.Root className="w-full md:flex-1">
                <Input.Label>Setor:</Input.Label>
                <Input.Controller
                  register={register('category')}
                  type="text"
                />
                <Input.Error>
                  {errors.category && <p>{errors.category.message?.toString()}</p>}
                </Input.Error>
              </Input.Root>
              <Input.Root className="w-full">
                <Input.Label>Contato:</Input.Label>
                <Input.MaskedController
                  register={register('contact')}
                  mask={selectedMask}

                />
                <Input.Error>
                  {errors.contact && <p>{errors.contact.message?.toString()}</p>}
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
