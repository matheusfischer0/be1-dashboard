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
      <Sidebar />
      <div id="main" className="flex h-screen flex-1 flex-col">
        <Header />
        <div className="flex-1 overflow-y-auto px-4 md:px-8">{children}</div>
      </div>
    </div>
  )
}
