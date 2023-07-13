'use client'

import Image from 'next/image'
import React from 'react'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import { signIn } from 'next-auth/react'

export type ICredentialsProps = {
  email?: string
  password?: string
}

const handleLoginFormSchema = z.object({
  email: z.string().email('Insira um email valido'),
  password: z.string().min(6).max(32),
})

export default function LoginPage() {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<ICredentialsProps>({
    mode: 'onSubmit',
    resolver: zodResolver(handleLoginFormSchema),
  })

  async function handleLogin({ email, password }: ICredentialsProps) {
    await signIn('credentials', {
      email,
      password,
    })
  }

  return (
    <div className="h-screen w-screen flex bg-white">
      <div className="p-0 md:p-10 flex items-center justify-center w-full lg:min-w-[1024px] lg:basis-3/4">
        <div className="flex w-full md:w-3/4 lg:w-2/4 flex-col md:rounded-3xl items-center justify-center py-4 shadow-lg">
          <div className="p-5">
            <Image
              src="/images/BE1 - logotipo - Alta Res 1.png"
              width={150}
              height={150}
              alt="Picture of the author"
            />
          </div>
          <form
            className="w-full md:w-3/4 px-6 flex flex-col items-center"
            onSubmit={handleSubmit(handleLogin)}
          >
            <div className="flex flex-col w-full">
              <label className="p-2 text-black">Email</label>
              <input
                className="p-2 bg-white rounded-md text-black"
                type="email"
                placeholder="Email"
                {...register('email')}
              />
              {errors?.email?.message && (
                <label className="p-2 text-red-600 text-xs">
                  {errors.email.message}
                </label>
              )}
            </div>
            <div className="flex flex-col w-full">
              <label className="p-2 text-black">Password</label>
              <input
                className="p-2 bg-white rounded-md text-black"
                {...register('password')}
                type="password"
                placeholder="Senha"
              />
              {errors?.password?.message && (
                <label className="p-2 text-red-600 text-xs">
                  {errors.password.message}
                </label>
              )}
            </div>
            <button
              className="w-full py-3 my-4 rounded-md bg-[#2670C3] "
              type="submit"
            >
              Login
            </button>
          </form>
        </div>
      </div>
      <div className="relative h-screen basis-1/4 hidden lg:block">
        <Image
          src="/images/Login-style.png"
          alt="Picture of the author"
          fill
          className="object-cover"
        />
      </div>
    </div>
  )
}
