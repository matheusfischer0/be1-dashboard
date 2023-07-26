import { ReactNode } from 'react'

import { PathNavigation } from '@/app/components/pathNavigation.component'
import { LinkButton } from '@/app/components/buttons.component'

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen flex-1 flex-col">
      <PathNavigation />
      <div className="flex text-black overflow-x-auto border-b border-gray-100">
        <LinkButton
          href="/admin/configuracoes/contatos"
          className="px-6 py-1 border-b-2 border-r rounded-r-md border-gray-200 hover:border-gray-400 hover:text-black"
        >
          Contatos
        </LinkButton>
        <LinkButton
          href="/admin/configuracoes/produtos"
          className="px-6 py-1 border-b-2 border-r rounded-r-md border-gray-200 hover:border-gray-400 hover:text-black"
        >
          Produtos
        </LinkButton>
        <LinkButton
          href="/admin/configuracoes/videos"
          className="px-6 py-1 border-b-2 border-r rounded-r-md border-gray-200 hover:border-gray-400 hover:text-black"
        >
          Videos
        </LinkButton>
      </div>
      <div className="flex-1 overflow-y-auto pt-4">{children}</div>
    </div>
  )
}
