'use client'

// components/Header.tsx
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import Loading from './loading.component'

export default function Header() {
  const { data: session, status } = useSession()

  if (status === 'loading') return <Loading />

  return (
    <header className="flex items-center justify-between text-black pt-8 pb-4 px-4 md:px-8">
      <div>
        <span className="md:text-xl font-medium">
          Bem vindo, <span className="capitalize">{session?.user?.name}</span>
        </span>
      </div>
      <div className="flex items-center gap-x-3">
        {session?.user?.avatarUrl && (
          <Image
            className="rounded-full"
            src={session?.user?.avatarUrl}
            alt="User Avatar"
            width={35}
            height={35}
          />
        )}
      </div>
    </header>
  )
}
