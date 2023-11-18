"use client";

import { IService } from "@/interfaces/IService";
import React, { useCallback, useState } from "react";

import Table from "@/app/components/table.component";
import { useServices } from "@/hooks/useServices";
import { useRouter } from "next/navigation";
import { useToast } from "@/app/components/toast.component";
import { BsPlusLg } from "react-icons/bs";
import { LinkButton } from "@/app/components/buttons.component";

import { DynamicTable } from "@/app/components/tables/dynamicTable.component";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { CaretSortIcon, DotsHorizontalIcon } from "@radix-ui/react-icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface IColumnsFieldsProps {
  onEditRow?: (service: IService) => void;
  onDeleteRow?: (service: IService) => void;
  onMoveUp?: (service: IService) => void;
  onMoveDown?: (service: IService) => void;
}

const columnsFields = ({
  onEditRow,
  onDeleteRow,
  onMoveUp,
  onMoveDown,
}: IColumnsFieldsProps): ColumnDef<IService>[] => [
  {
    header: "",
    id: "order",
    accessorKey: "order",
    cell: ({ row }) => {
      return (
        <div className="text-black font-medium">{row.getValue("order")}</div>
      );
    },
  },
  {
    accessorKey: "description",
    header: ({ column }) => {
      return (
        <Button
          className="p-0"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          type="button"
        >
          Descrição
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div className="">{row.getValue("description")}</div>,
  },
  {
    accessorKey: "createdAt",
    header: () => <div className="text-right">Criado em:</div>,
    cell: ({ row }) => {
      const parsedDate = new Date(row.getValue("createdAt"));
      if (!row.getValue("createdAt"))
        return <div className="text-right font-medium">Não salvo</div>;
      // Format the amount as a dollar amount
      const formatted =
        parsedDate.getUTCDate() +
        "/" +
        parsedDate.getUTCMonth() +
        "/" +
        parsedDate.getUTCFullYear();

      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "actions",
    header: "Ações",
    cell: ({ row }) => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild={true}>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Abrir Menu</span>
              <DotsHorizontalIcon className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-white" align="end">
            <DropdownMenuLabel className="text-black">Ações</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {onEditRow ? (
              <DropdownMenuItem
                className="text-black hover:cursor-pointer hover:bg-zinc-200 transition-all duration-300"
                onClick={() => {
                  onEditRow(row.original);
                }}
              >
                Editar
              </DropdownMenuItem>
            ) : null}
            <DropdownMenuSeparator />
            {onDeleteRow ? (
              <DropdownMenuItem
                className="text-red-600 hover:cursor-pointer hover:bg-red-200 transition-all duration-300"
                onClick={() => onDeleteRow(row.original)}
              >
                Deletar
              </DropdownMenuItem>
            ) : null}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export default function Servicos() {
  const { services, isLoading, error, deleteService } = useServices();
  const [selectedService, setSelectedService] = useState<IService>();

  const router = useRouter();
  const { Toast, openToast } = useToast();

  function handleEdit(service: IService) {
    router.push(`/admin/configuracoes/servicos/${service.id}`);
  }

  function handleConfirmDelete(service: IService) {
    setSelectedService(service);
    openToast(
      `Você tem certeza que deseja excluir ${selectedService}?`,
      () => handleDelete(),
      handleCancelDelete
    );
  }

  const handleDelete = useCallback(() => {
    if (selectedService) deleteService(selectedService?.id);
  }, [deleteService, selectedService]);

  const handleCancelDelete = useCallback(() => {
    console.log("Deleted ", selectedService?.description);
  }, [selectedService]);

  if (isLoading) return <p>Loading...</p>;
  if (error)
    return (
      <p>Ocorreu um erro ao carregar a tabela de serviços: {error.message}</p>
    );

  return (
    <div className="flex-1 items-center justify-center text-black px-3">
      <Toast
        message={`Você tem certeza que deseja excluir ${selectedService?.description}?`}
        onCancel={handleCancelDelete}
        onConfirm={() => handleDelete()}
      />
      <div className="flex justify-between items-center pb-2">
        <div className="text-lg font-medium">Serviços</div>
        <div>
          <LinkButton
            className="bg-gradient-to-r from-blue-600 to-blue-400 text-white px-4 py-2 rounded-full"
            href={"/admin/configuracoes/servicos/cadastro"}
          >
            <BsPlusLg className="mr-2" size={24} />
            <span className="whitespace-nowrap">Novo Serviço</span>
          </LinkButton>
        </div>
      </div>
      {services && (
        <DynamicTable<IService>
          data={services}
          columns={columnsFields({
            onEditRow: handleEdit,
            onDeleteRow: handleConfirmDelete,
          })}
          searchByPlaceholder="Procurar..."
        />
      )}
    </div>
  );
}
