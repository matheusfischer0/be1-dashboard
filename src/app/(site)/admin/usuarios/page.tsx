"use client";

import { IUser } from "@/interfaces/IUser";
import React, { useState } from "react";

import Table from "@/app/components/table.component";
import { useUsers } from "@/hooks/useUsers";
import { useRouter } from "next/navigation";
import { useToast } from "@/app/components/toast.component";
import { LinkButton } from "@/app/components/buttons.component";
import { Button } from "@/components/ui/button";

import { AiOutlineUserAdd } from "react-icons/ai";
import Loading from "@/app/components/loading.component";

import { ColumnDef } from "@tanstack/react-table";
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
import { DynamicTable } from "@/app/components/tables/dynamicTable.component";
import { convertRoleToPortuguese } from "@/utils/convertRoleToPortuguese";

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
  onEditRow: (user: IUser) => void;
  onDeleteRow: (user: IUser) => void;
  setSelectedRows: React.Dispatch<React.SetStateAction<string[]>>;
}

const columnsFields = ({
  onEditRow,
  onDeleteRow,
  setSelectedRows,
}: IColumnsFieldsProps): ColumnDef<IUser>[] => [
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
    accessorKey: "name",
    header: "Nome",
    cell: ({ row }) => <div className="capitalize">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div className="lowercase">{row.getValue("email")}</div>,
  },
  {
    accessorKey: "state",
    enableHiding: true,
    header: "Estado",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("state")}</div>
    ),
  },
  {
    accessorKey: "city",
    enableHiding: true,
    header: "Cidade",
    cell: ({ row }) => <div className="capitalize">{row.getValue("city")}</div>,
  },
  {
    accessorKey: "role",
    enableHiding: true,
    header: "Tipo de usuário",
    cell: ({ row }) => (
      <div className="capitalize">
        {convertRoleToPortuguese(row.getValue("role"))}
      </div>
    ),
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

export default function Usuarios() {
  const { users, isLoading, error, deleteUser } = useUsers();
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  const [selectedUser, setSelectedUser] = useState<IUser>();

  const router = useRouter();
  const { Toast, openToast } = useToast();

  function handleEdit(user: IUser) {
    router.push(`/admin/usuarios/${user.id}`);
  }

  function handleDelete(user: IUser) {
    setSelectedUser(user);
    openToast(
      `Você tem certeza que deseja excluir ${selectedUser?.name}?`,
      () => handleDeleteUser(),
      () => {
        return null;
      }
    );
  }

  function handleDeleteUser() {
    if (selectedUser) deleteUser(selectedUser?.id);
  }

  if (isLoading) return <Loading />;
  if (error)
    return (
      <p>Ocorreu um erro ao carregar a tabela de usuários: {error.message}</p>
    );

  return (
    <div className="flex-1 items-center justify-center text-black pt-4">
      <Toast />
      <div className="flex justify-between items-center pb-2">
        <div className="text-xl font-medium">Usuários</div>
        <div>
          <LinkButton
            className="bg-gradient-to-r from-blue-600 to-blue-400 text-white px-4 py-2 rounded-full"
            href={"/admin/usuarios/cadastro"}
          >
            <AiOutlineUserAdd className="mr-2" size={24} />
            <span className="whitespace-nowrap">Novo usuário</span>
          </LinkButton>
        </div>
      </div>
      {users && (
        <DynamicTable<IUser>
          data={users}
          columns={columnsFields({
            onEditRow: handleEdit,
            onDeleteRow: handleDelete,
            setSelectedRows,
          })}
          searchByPlaceholder={"Procurar..."}
        />
      )}
    </div>
  );
}
