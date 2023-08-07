'use client'

// components/Header.tsx
import { useSession } from 'next-auth/react'
import Image from 'next/image'

import { BsFillPersonFill } from 'react-icons/bs'


export default function Header() {
  const { data: session, status } = useSession()

  return (
    <header className="flex items-center justify-between text-black pt-8 pb-4 px-4 md:px-8">
      <div>
        <span className="md:text-xl font-medium">
          Bem vindo, {session?.user?.name ?
            <span className="capitalize">{session?.user?.name}</span> :
            <span className="capitalize">...</span>
          }
        </span>
      </div>
      <div className="flex items-center gap-x-3">
        {session?.user?.avatarUrl ? (
          <Image
            className="rounded-full"
            src={session?.user?.avatarUrl}
            alt="User Avatar"
            width={36}
            height={36}
          />
        ) :
          <div className='flex items-center justify-center w-9 h-9 rounded-full bg-[#4E4E4E]'>
            <BsFillPersonFill size={24} className="text-zinc-200"></BsFillPersonFill>
          </div>
        }
      </div>
    </header>
  )
}
