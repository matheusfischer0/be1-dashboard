'use client'

import { ReactNode } from 'react'

import Header from '@/app/components/header.component'
import Loading from '@/app/components/loading.component'
import Sidebar from '@/app/components/sidebar.component'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'


export default function Layout({ children }: { children: ReactNode }) {
  const session = useSession()

  if (session.status === 'unauthenticated' || session.status === 'loading')
    return <Loading />

  return (
    <div className={`flex bg-white`}>
      <div>
        <Sidebar />
      </div>
      <div id="main" className="flex-1 w-full px-3 md:px-4">
        <Header />
        <div className="flex-1">{children}</div>
      </div>
    </div>
  )
}
