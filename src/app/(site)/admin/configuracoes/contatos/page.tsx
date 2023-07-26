'use client'

import { IContact } from '@/interfaces/IContact'
import React, { useState } from 'react'

import Table from '@/app/components/table.component'
import { useContacts } from '@/hooks/useContacts'
import { useRouter } from 'next/navigation'
import { useToast } from '@/app/components/toast.component'
import { BsPlusLg } from 'react-icons/bs'
import { LinkButton } from '@/app/components/buttons.component'

export default function Produtos() {
  const { contacts, isLoading, error, deleteContact } = useContacts()
  const [selectedContact, setSelectedContact] = useState<IContact>()

  const router = useRouter()
  const { Toast, openToast } = useToast()

  function handleEdit(contact: IContact) {
    router.push(`/admin/configuracoes/contatos/${contact.id}`)
  }

  function handleDelete(contact: IContact) {
    setSelectedContact(contact)
    openToast(
      `Você tem certeza que deseja excluir ${selectedContact?.contact}?`,
      () => handleDeleteContact(),
      handleCancelDelete,
    )
  }

  function handleDeleteContact() {
    if (selectedContact) deleteContact(selectedContact?.id)
  }

  function handleCancelDelete() {
    console.log('Deleted ', selectedContact?.contact)
  }

  if (isLoading) return <p>Loading...</p>
  if (error)
    return (
      <p>Ocorreu um erro ao carregar a tabela de usuários: {error.message}</p>
    )

  return (
    <div className="flex-1 items-center justify-center text-black">
      <Toast
        message={`Você tem certeza que deseja excluir ${selectedContact?.contact}?`}
        onCancel={handleCancelDelete}
        onConfirm={() => handleDeleteContact()}
      />
      <div className="flex justify-between items-center pb-2">
        <div className="text-lg font-medium">Contatos</div>
        <div>
          <LinkButton
            className="bg-gradient-to-r from-blue-600 to-blue-400 text-white px-4 py-2 rounded-full"
            href={'/admin/configuracoes/contatos/cadastro'}
          >
            <BsPlusLg className="mr-2" size={24} />
            <span className="whitespace-nowrap">Novo Contato</span>
          </LinkButton>
        </div>
      </div>
      {contacts && (
        <Table
          items={contacts}
          headers={{
            keys: ['type', 'category', 'contact'],
            headers: ['Tipo', 'Setor', 'Contato', 'Ações'],
          }}
          actions={['edit', 'delete']}
          handleEdit={(item) => handleEdit(item)}
          handleDelete={(item) => handleDelete(item)}
        />
      )}
    </div>
  )
}
