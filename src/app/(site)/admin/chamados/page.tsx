'use client'

import { IAssistance } from '@/interfaces/IAssistance'
import React, { useState } from 'react'

import Table from '@/app/components/table.component'
import { useAssistances } from '@/hooks/useAssistances'
import { useRouter } from 'next/navigation'
import { useToast } from '@/app/components/toast.component'
import { BsPlusLg } from 'react-icons/bs'
import { LinkButton } from '@/app/components/buttons.component'

export default function Chamados() {
  const { assistances, isLoading, error, deleteAssistance } = useAssistances()
  const [selectedAssistance, setSelectedAssistance] = useState<IAssistance>()

  const router = useRouter()
  const { Toast, openToast } = useToast()

  function handleEdit(assistance: IAssistance) {
    router.push(`/admin/chamados/${assistance.id}`)
  }

  function handleDelete(assistance: IAssistance) {
    setSelectedAssistance(assistance)
    openToast(
      `Você tem certeza que deseja excluir ${selectedAssistance?.title}?`,
      () => handleDeleteAssistance(),
      handleCancelDelete,
    )
  }

  function handleDeleteAssistance() {
    if (selectedAssistance) deleteAssistance(selectedAssistance?.id)
  }

  function handleCancelDelete() {
    console.log('Deleted ', selectedAssistance?.title)
  }

  if (isLoading) return <p>Loading...</p>
  if (error)
    return (
      <p>Ocorreu um erro ao carregar a tabela de usuários: {error.message}</p>
    )

  return (
    <div className="flex-1 items-center justify-center text-black">
      <Toast
        message={`Você tem certeza que deseja excluir ${selectedAssistance?.title}?`}
        onCancel={handleCancelDelete}
        onConfirm={() => handleDeleteAssistance()}
      />
      <div className="flex justify-between items-center pb-2">
        <div className="text-lg font-medium">Chamados</div>
        <div>
          {/* <LinkButton
            className="bg-gradient-to-r from-blue-600 to-blue-400 text-white px-4 py-2 rounded-full"
            href={'/admin/configuracoes/chamados/cadastro'}
          >
            <BsPlusLg className="mr-2" size={24} />
            <span className="whitespace-nowrap">Novo Produto</span>
          </LinkButton> */}
        </div>
      </div>
      <div className="overflow-y-auto">
        {assistances && (
          <Table
            items={assistances}
            headers={{
              keys: ['title', 'description', 'productName', 'status'],
              headers: ['Nome', 'Descrição', 'Produto', 'Status', 'Ações'],
            }}
            actions={['edit', 'delete']}
            handleEdit={(item) => handleEdit(item)}
            handleDelete={(item) => handleDelete(item)}
          />
        )}
      </div>
    </div>
  )
}
