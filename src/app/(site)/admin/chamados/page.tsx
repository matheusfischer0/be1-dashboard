"use client";

import { IAssistance } from "@/interfaces/IAssistance";
import React, { useCallback, useMemo, useState } from "react";

import { useAssistances } from "@/hooks/useAssistances";
import { useRouter } from "next/navigation";
import { useToast } from "@/app/components/toast.component";
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

function updateSelectedRows(
  rowId: string,
  isSelected: boolean,
  setSelectedRows: React.Dispatch<React.SetStateAction<string[]>>
) {
  setSelectedRows((prev) => {
    const newSelectedRows = new Set(prev);
    if (isSelected) {
      newSelectedRows.add(rowId);
    } else {
      newSelectedRows.delete(rowId);
    }
    return Array.from(newSelectedRows);
  });
}

interface IColumnsFieldsProps {
  onEditRow?: (assistance: IAssistance) => void;
  onDeleteRow?: (assistance: IAssistance) => void;
  setSelectedRows: React.Dispatch<React.SetStateAction<string[]>>;
}

const columnsFields = ({
  onEditRow,
  onDeleteRow,
  setSelectedRows,
}: IColumnsFieldsProps): ColumnDef<IAssistance>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => {
          row.toggleSelected(!!value);
          updateSelectedRows(row.id, !!value, setSelectedRows);
        }}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "title",
    header: "Título",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("title")}</div>
    ),
  },
  {
    accessorKey: "description",
    header: ({ column }) => {
      return (
        <Button
          className="p-0"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Descrição
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="lowercase">{row.getValue("description")}</div>
    ),
  },
  {
    accessorKey: "productName",
    enableHiding: true,
    header: ({ column }) => {
      return (
        <Button
          className="p-0"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Produto
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("productName")}</div>
    ),
  },
  {
    accessorKey: "status",
    enableHiding: true,
    header: ({ column }) => {
      return (
        <Button
          className="p-0"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Status
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("status")}</div>
    ),
  },
  {
    accessorKey: "clientName",
    enableHiding: true,
    header: ({ column }) => {
      return (
        <Button
          className="p-0"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Cliente
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("clientName")}</div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: () => <div className="text-right">Criado Em:</div>,
    cell: ({ row }) => {
      const parsedDate = new Date(row.getValue("createdAt"));

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

export default function Chamados() {
  const { assistances, isLoading, error, deleteAssistance } = useAssistances();
  const [selectedAssistance, setSelectedAssistance] = useState<IAssistance>();
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  const router = useRouter();
  const { Toast, openToast } = useToast();

  const handleEdit = (assistance: IAssistance) => {
    router.push(`/admin/chamados/${assistance.id}`);
  };

  const handleDeleteAssistance = useCallback(() => {
    if (selectedAssistance) deleteAssistance(selectedAssistance?.id);
  }, [deleteAssistance, selectedAssistance]);

  const handleCancelDelete = useCallback(() => {
    console.log("Deleted ", selectedAssistance?.title);
  }, [selectedAssistance]);

  const handleDelete = useCallback(
    (assistance: IAssistance) => {
      setSelectedAssistance(assistance);
      openToast(
        `Você tem certeza que deseja excluir ${assistance?.title}?`,
        () => handleDeleteAssistance(),
        handleCancelDelete
      );
    },
    [openToast, handleDeleteAssistance, handleCancelDelete]
  );

  if (isLoading) return <p>Loading...</p>;
  if (error)
    return (
      <p>Ocorreu um erro ao carregar a tabela de usuários: {error.message}</p>
    );

  return (
    <div className="flex-1 items-center justify-center text-black">
      <Toast
        message={`Você tem certeza que deseja excluir ${selectedAssistance?.title}?`}
        onCancel={handleCancelDelete}
        onConfirm={() => handleDeleteAssistance()}
      />
      <div className="flex justify-between items-center">
        <div className="text-lg font-medium">Chamados</div>
      </div>
      {assistances && (
        <DynamicTable<IAssistance>
          data={assistances}
          columns={columnsFields({
            onEditRow: handleEdit,
            onDeleteRow: handleDelete,
            setSelectedRows,
          })}
          searchByPlaceholder="Procurar..."
        />
      )}
    </div>
  );
}
