'use client'

import { ReactNode } from 'react'

import { PathNavigation } from '@/app/components/pathNavigation.component'
import { LinkButton } from '@/app/components/buttons.component'
import { usePathname, useRouter } from 'next/navigation'

const defaultRoutes = [
  {
    url: "/admin/configuracoes/contatos",
    name: 'Contatos'
  },
  {
    url: "/admin/configuracoes/produtos",
    name: 'Produtos'
  },
  {
    url: "/admin/configuracoes/videos",
    name: 'Videos'
  },
]

export default function Layout({ children }: { children: ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="flex h-screen flex-1 flex-col">
      <PathNavigation />
      <div className="flex text-black overflow-x-auto border-b border-gray-100">
        {defaultRoutes.map(route => (
          <LinkButton
            key={route.url}
            href={route.url}
            className={`px-6 py-1 border-b-2 border-gray-200 hover:border-gray-400 hover:text-black hover:border-blue-900 transition-all duration-300 ${pathname === route.url ? ' border-blue-500 bg-blue-100' : ''}`}
          >
            {route.name}
          </LinkButton>
        ))}
      </div>
      <div className="flex-1 overflow-y-auto pt-4">{children}</div>
    </div>
  )
}
