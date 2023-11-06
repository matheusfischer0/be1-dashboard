"use client";

import React, { useEffect } from "react";
import { z } from "zod";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/app/components/inputs.component";
import { Button } from "@/app/components/buttons.component";
import { useFile } from "@/hooks/useFile";
import { IAssistance } from "@/interfaces/IAssistance";
import Image from "next/image";
import { FiTrash } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { useAssistance } from "@/hooks/useAssistance";
import { useAssistanceStatus } from "@/hooks/useAssistanceStatus";

interface EditPageProps {
  params: { id: string };
}

export default function EditPage({ params }: EditPageProps) {
  const { status } = useAssistanceStatus();
  const { assistance, refetchAssistance, isLoading, error } = useAssistance(
    params.id
  );

  useEffect(() => {}, [assistance, status, params]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>An error has occurred: {error.message}</div>;

  return (
    <div className="flex-1 items-center justify-center text-zinc-900">
      <div className="pb-2 text-xl font-bold">Detalhes do chamado</div>
      <div className="flex gap-2">
        <strong>Identificador:</strong>
        <div>{assistance?.id}</div>
      </div>
      <div className="flex gap-2">
        <strong>Produto:</strong>
        <div>{assistance?.productName}</div>
      </div>
      <div className="flex gap-2">
        <strong>Nome do cliente:</strong>
        <div>{assistance?.client.name}</div>
      </div>
      <div className="flex gap-2">
        <strong>Descrição:</strong>
        <div>{assistance?.description}</div>
      </div>
      <div className="flex gap-2">
        <strong>Status:</strong>
        <div>{assistance?.status}</div>
      </div>
      <div className="flex gap-2">
        <strong>Observação do técnico:</strong>
        <div>{assistance?.observation}</div>
      </div>
    </div>
  );
}
