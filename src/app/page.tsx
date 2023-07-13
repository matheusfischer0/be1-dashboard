'use client'

import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import Loading from "./components/loading.component"

export default function Home() {
  const session = useSession()

  if (session.status === 'unauthenticated') return redirect('/auth/login')
  if (session.status === 'authenticated') return redirect('/admin')
  if (session.status === 'loading') return <Loading />

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          BE1 TECNOLOGIA
        </p>
      </div>
    </main>
  )
}
