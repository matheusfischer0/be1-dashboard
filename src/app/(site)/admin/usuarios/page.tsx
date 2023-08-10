'use client'

import { IUser } from '@/interfaces/IUser'
import React, { useState } from 'react'

import Table from '@/app/components/table.component'
import { useUsers } from '@/hooks/useUsers'
import { useRouter } from 'next/navigation'
import { useToast } from '@/app/components/toast.component'
import { LinkButton } from '@/app/components/buttons.component'

import { AiOutlineUserAdd } from 'react-icons/ai'
import Loading from '@/app/components/loading.component'

export default function Usuarios() {
  const { users, isLoading, error, deleteUser } = useUsers()

  const [selectedUser, setSelectedUser] = useState<IUser>()

  const router = useRouter()
  const { Toast, openToast } = useToast()

  function handleEdit(user: IUser) {
    router.push(`/admin/usuarios/${user.id}`)
  }

  function handleDelete(user: IUser) {
    setSelectedUser(user)
    openToast(
      `Você tem certeza que deseja excluir ${selectedUser?.name}?`,
      () => handleDeleteUser(),
      () => {
        return null
      },
    )
  }

  function handleDeleteUser() {
    if (selectedUser) deleteUser(selectedUser?.id)
  }

  if (isLoading) return <Loading />
  if (error) return (
    <p>Ocorreu um erro ao carregar a tabela de usuários: {error.message}</p>
  )

  return (
    <div className="flex-1 items-center justify-center text-black pt-4">
      <Toast
        message={`Você tem certeza que deseja excluir ${selectedUser?.name}?`}
        onCancel={() => { }}
        onConfirm={() => handleDeleteUser()}
      />
      <div className="flex justify-between items-center pb-2">
        <div className="text-xl font-medium">Usuários</div>
        <div>
          <LinkButton
            className="bg-gradient-to-r from-blue-600 to-blue-400 text-white px-4 py-2 rounded-full"
            href={'/admin/usuarios/cadastro'}
          >
            <AiOutlineUserAdd className="mr-2" size={24} />
            <span className="whitespace-nowrap">Novo usuário</span>
          </LinkButton>
        </div>
      </div>
      {users && (
        <Table
          items={users}
          headers={{
            keys: ['name', 'email', 'cpf', 'phone', 'role'],
            headers: [
              'Nome',
              'E-mail',
              'CPF',
              'Telefone',
              'Tipo de usuário',
              'Ações',
            ],
          }}
          actions={['edit', 'delete']}
          handleEdit={(item) => handleEdit(item)}
          handleDelete={(item) => handleDelete(item)}
        />
      )}
    </div>
  )
}
