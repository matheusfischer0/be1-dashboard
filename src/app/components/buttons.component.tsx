'use client'

import { signIn, signOut } from 'next-auth/react'
import Link, { LinkProps } from 'next/link'
import { ButtonHTMLAttributes, ReactNode, ComponentProps } from 'react'

interface IButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  disabled?: boolean
  className?: ComponentProps<'div'>['className']
}

export const LoginButton = ({
  children,
  className,
  disabled = false,
  ...rest
}: IButtonProps) => {
  return (
    <button
      disabled={disabled}
      className={`h-[52px] w-full rounded-md flex items-center justify-start hover ${className}`}
      onClick={() => signIn()}
      {...rest}
    >
      {children}
    </button>
  )
}

export const LogoutButton = ({
  children,
  className,
  disabled = false,
  ...rest
}: IButtonProps) => {
  return (
    <button
      disabled={disabled}
      className={`h-[52px] w-full rounded-md flex items-center justify-start hover ${className}`}
      onClick={() => signOut()}
      {...rest}
    >
      {children}
    </button>
  )
}

export const Button = ({
  children,
  className,
  disabled = false,
  ...rest
}: IButtonProps) => {
  return (
    <button
      disabled={disabled}
      className={`h-[52px] flex items-center justify-start hover:bg-gray-100 transition-all ease-in-out duration-300 ${className}`}
      {...rest}
    >
      {children}
    </button>
  )
}

interface LinkButtonProps extends LinkProps {
  children: ReactNode | string
  className?: ComponentProps<'div'>['className']
}

export const LinkButton = ({
  children,
  className,
  ...rest
}: LinkButtonProps) => {
  return (
    <Link
      className={`w-full flex items-center justify-start hover ${className}`}
      {...rest}
    >
      {children}
    </Link>
  )
}
