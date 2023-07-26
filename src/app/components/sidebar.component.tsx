'use client'

import Image from 'next/image'
import React, { useState } from 'react'
import { LogoutButton, LinkButton } from './buttons.component'

import { FiHome, FiUsers } from 'react-icons/fi'
import { BsListTask } from 'react-icons/bs'
import { GiSettingsKnobs } from 'react-icons/gi'
import { SlLogout } from 'react-icons/sl'
import { VscChevronLeft, VscChevronRight } from 'react-icons/vsc'

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true)

  return (
    <div
      className={`relative flex h-screen text-black shadow-sidebar bg-white border-r border-r-gray-100
                  ${isOpen ? 'w-0 md:block md:w-20' : 'w-20 md:w-44'}`}
    >
      <button
        id="open-close-sidebar"
        className={`absolute bottom-[34px] right-[-3rem] flex items-center 
        justify-center text-black bg-white w-12 h-12 rounded-r-md border border-l-0`}
        onClick={() => {
          setIsOpen(!isOpen)
        }}
      >
        {!isOpen ? <VscChevronLeft size={32} /> : <VscChevronRight size={32} />}
      </button>
      <div className={`flex flex-col overflow-hidden`}>
        <div className="p-2 h-40">
          <Image
            src="/images/BE1 - logotipo - Alta Res 1.png"
            width={120}
            height={120}
            alt="Picture of the author"
          />
        </div>
        <nav className="">
          <ul className="flex flex-col">
            <LinkButton
              href={'/admin'}
              className={`flex items-center justify-center w-full border-b
                         border-b-zinc-200 px-4 h-[52px]
                         ${isOpen ? '' : ' md:justify-start'} `}
              prefetch
            >
              <div className={`${isOpen ? 'pr-0' : 'pr-2'}`}>
                <FiHome size={20} />
              </div>
              <span
                className={`hidden text-md md:block 
                ${isOpen ? 'md:hidden' : ''}`}
              >
                Geral
              </span>
            </LinkButton>
            <LinkButton
              href={'/admin/chamados'}
              className={`flex items-center justify-center w-full border-b border-b-zinc-200 px-4 h-[52px]
              ${isOpen ? '' : ' md:justify-start'} `}
              prefetch
            >
              <div className={`${isOpen ? 'pr-0' : 'pr-2'}`}>
                <BsListTask size={20} />
              </div>
              <span
                className={`hidden text-md md:block 
                ${isOpen ? 'md:hidden' : ''}`}
              >
                Chamados
              </span>
            </LinkButton>
            <LinkButton
              href={'/admin/usuarios'}
              className={`flex items-center justify-center w-full 
              border-b border-b-zinc-200 px-4 h-[52px] 
              ${isOpen ? '' : ' md:justify-start'} `}
              prefetch
            >
              <div className={`${isOpen ? 'pr-0' : 'pr-2'}`}>
                <FiUsers size={20} />
              </div>
              <span
                className={`hidden text-md md:block 
                ${isOpen ? 'md:hidden' : ''}`}
              >
                Usuários
              </span>
            </LinkButton>
            <LinkButton
              href={'/admin/configuracoes'}
              className={`flex items-center justify-center w-full border-b border-b-zinc-200 px-4 h-[52px] 
              ${isOpen ? '' : ' md:justify-start'} `}
              prefetch
            >
              <div className={`${isOpen ? 'pr-0' : 'pr-2'}`}>
                <GiSettingsKnobs size={20} />
              </div>
              <span
                className={`hidden text-md md:block 
                ${isOpen ? 'md:hidden' : ''}`}
              >
                Configurações
              </span>
            </LinkButton>
          </ul>
        </nav>
        <div className="flex-1">
          <LogoutButton
            className={`flex items-center justify-center w-full border-b 
            border-b-zinc-200 px-4 text-red-500 mb-32 h-[52px] 
            ${isOpen ? '' : ' md:justify-start'}`}
          >
            <div
              className={`md:pr-2 ${isOpen ? 'md:pr-0 hidden md:block' : ''}`}
            >
              <SlLogout size={20} />
            </div>
            <span
              className={`hidden text-md md:block ${isOpen ? 'md:hidden' : ''}`}
            >
              Sair
            </span>
          </LogoutButton>
        </div>
      </div>
    </div>
  )
}
