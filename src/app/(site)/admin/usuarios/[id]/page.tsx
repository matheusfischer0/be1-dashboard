'use client'

import React, { useEffect } from 'react'
import { useUsers } from '@/hooks/useUsers'
import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Input } from '@/app/components/inputs.component'
import { useRouter } from 'next/navigation'
import { useCities } from '@/hooks/useCities'
import { useUser } from '@/hooks/useUser'
import { cpfIsComplete, cpfIsValid } from '@/lib/cpf-validator'
import { DEFAULT_ROLES } from '@/constants/defaultRoles'

interface EditPageProps {
  params: { id: string }
}


// Define the zod schema
const userSchema = z.object({
  name: z.string().nonempty(),
  email: z.string().email('E-mail inválido'),
  phone: z.string(),
  state: z.string(),
  city: z.string(),
  cpf: z.string().refine(cpfIsComplete, {
    message: "CPF está incompleto",
  }).refine(cpfIsValid, {
    message: "CPF Inválido",
  }),
  role: z.enum(['ADMIN', 'CLIENT', 'ASSISTENT', 'USER']),
})

type UpdateUserFormData = z.infer<typeof userSchema>

export default function EditPage({ params }: EditPageProps) {
  const { user, isLoading, error, updateUser } = useUser(params.id)
  const router = useRouter()

  const methods = useForm<UpdateUserFormData>({
    resolver: zodResolver(userSchema),
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = methods

  const selectedState = watch('state')
  const { cities, states, filterCities } = useCities(selectedState)

  useEffect(() => {
    if (selectedState) {
      filterCities()
    }
  }, [selectedState, filterCities])

  useEffect(() => {
    if (user) {
      setValue('name', user.name)
      setValue('email', user.email)
      if (user.phone) setValue('phone', user.phone)
      if (user.state) setValue('state', user.state)
      if (user.city) setValue('city', user.city)
      if (user.cpf) setValue('cpf', user.cpf)
      setValue('role', user.role)
    }
  }, [user, states, cities, params, setValue])

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>An error has occurred: {error.message}</div>

  const onSubmit = (data: UpdateUserFormData) => {
    if (data.name && user?.id) {
      updateUser({
        id: user.id,
        ...data,
      })
    }
    router.push('/admin/usuarios')
  }

  return (
    <div className="flex-1 items-center justify-center text-zinc-900">
      <div className="pb-2 text-xl font-bold">Editar Usuário</div>
      <FormProvider {...methods}>
        <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-row flex-wrap gap-3">
            <Input.Root className="w-full md:w-[500px]">
              <Input.Label>Nome:</Input.Label>
              <Input.Controller
                register={register('name')}
                type="text"
              />
              <Input.Error>
                {errors.name && <p>{errors.name.message?.toString()}</p>}
              </Input.Error>
            </Input.Root>
            <Input.Root className="w-full md:w-[500px]">
              <Input.Label>E-mail:</Input.Label>
              <Input.Controller
                register={register('email')}
                type="email"
              />
              <Input.Error>
                {errors.email && <p>{errors.email.message?.toString()}</p>}
              </Input.Error>
            </Input.Root>


            <Input.Root className="w-full md:w-[500px]">
              <Input.Label>Telefone:</Input.Label>
              <Input.MaskedController
                register={register('phone')}
                mask="(99) 99999-9999"
              />
              <Input.Error>
                {errors.phone && <p>{errors.phone.message?.toString()}</p>}
              </Input.Error>
            </Input.Root>
            <Input.Root className="w-full md:w-[500px]">
              <Input.Label>CPF:</Input.Label>
              <Input.MaskedController
                register={register('cpf')}
                mask="999.999.999-99"
              />
              <Input.Error>
                {errors.cpf && <p>{errors.cpf.message?.toString()}</p>}
              </Input.Error>
            </Input.Root>
            <Input.Root className="w-full md:w-[500px]">
              <Input.Label>Estado:</Input.Label>
              <Input.SelectController
                name="state"
                options={states}
              />
              <Input.Error>
                {errors.state && <p>{errors.state.message?.toString()}</p>}
              </Input.Error>
            </Input.Root>
            <Input.Root className="w-full md:w-[500px]">
              <Input.Label>Cidade:</Input.Label>
              <Input.SelectController
                name="city"
                options={cities}
              />
              <Input.Error>
                {errors.city && <p>{errors.city.message?.toString()}</p>}
              </Input.Error>
            </Input.Root>
            <Input.Root className="w-full md:w-[500px]">
              <Input.Label>Tipo de usuário:</Input.Label>
              <Input.SelectController
                name="role"
                options={DEFAULT_ROLES}
              />
              <Input.Error>
                {errors.role && <p>{errors.role.message?.toString()}</p>}
              </Input.Error>
            </Input.Root>

            {/* <Input.Root className="w-full md:w-[500px]">
              <Input.Label className='flex items-center'>Senha:</Input.Label>
              <Input.Label className='flex items-center'>
                <Input.Icon>
                  <MdDangerous size={44} className="text-red-400"></MdDangerous>
                </Input.Icon>
                <Input.Controller
                  className="w-full max-w-2xl border border-red-400"
                  register={register('password')}
                  type="password"
                />
              </Input.Label>
              <Input.Error>
                {errors.password && (
                  <p>{errors.password.message?.toString()}</p>
                )}
              </Input.Error>
            </Input.Root> */}
          </div>

          <div className="py-3">
            <button
              className="w-36 bg-blue-500 rounded-md p-3 text-white"
              type="submit"
            >
              Salvar
            </button>
          </div>
        </form>
      </FormProvider>
    </div>
  )
}
