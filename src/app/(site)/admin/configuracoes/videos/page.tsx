'use client'

import { IVideo } from '@/interfaces/IVideo'
import React, { useState } from 'react'

import Table from '@/app/components/table.component'
import { useVideos } from '@/hooks/useVideos'
import { useRouter } from 'next/navigation'
import { useToast } from '@/app/components/toast.component'
import { BsPlusLg } from 'react-icons/bs'
import { LinkButton } from '@/app/components/buttons.component'

export default function Produtos() {
  const { videos, isLoading, error, deleteVideo } = useVideos()
  const [selectedVideo, setSelectedVideo] = useState<IVideo>()

  const router = useRouter()
  const { Toast, openToast } = useToast()

  function handleEdit(video: IVideo) {
    router.push(`/admin/configuracoes/videos/${video.id}`)
  }

  function handleDelete(video: IVideo) {
    setSelectedVideo(video)
    openToast(
      `Você tem certeza que deseja excluir ${selectedVideo?.name}?`,
      () => handleDeleteVideo(),
      handleCancelDelete,
    )
  }

  function handleDeleteVideo() {
    if (selectedVideo) deleteVideo(selectedVideo?.id)
  }

  function handleCancelDelete() {
    console.log('Deleted ', selectedVideo?.name)
  }

  if (isLoading) return <p>Loading...</p>
  if (error)
    return (
      <p>Ocorreu um erro ao carregar a tabela de usuários: {error.message}</p>
    )

  return (
    <div className="flex-1 items-center justify-center text-black">
      <Toast
        message={`Você tem certeza que deseja excluir ${selectedVideo?.name}?`}
        onCancel={handleCancelDelete}
        onConfirm={() => handleDeleteVideo()}
      />
      <div className="flex justify-between items-center pb-2">
        <div className="text-lg font-medium">Videos</div>
        <div>
          <LinkButton
            className="bg-gradient-to-r from-blue-600 to-blue-400 text-white px-4 py-3 rounded-full"
            href={'/admin/configuracoes/videos/cadastro'}
          >
            <BsPlusLg className="mr-2" size={24} />
            <span className="whitespace-nowrap">Novo Video</span>
          </LinkButton>
        </div>
      </div>
      {videos && (
        <Table
          items={videos}
          headers={{
            keys: ['name', 'description'],
            headers: ['Nome', 'Descrição', 'Ações'],
          }}
          actions={['edit', 'delete']}
          handleEdit={(item) => handleEdit(item)}
          handleDelete={(item) => handleDelete(item)}
        />
      )}
    </div>
  )
}
