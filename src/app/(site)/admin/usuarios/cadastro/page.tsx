"use client";

import React, { useEffect, useState } from "react";
import { useUsers } from "@/hooks/useUsers";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/app/components/inputs.component";
import { useRouter } from "next/navigation";
import { useCities } from "@/hooks/useCities";
import { cpfIsComplete, cpfIsValid } from "@/lib/cpf-validator";
import { DEFAULT_ROLES } from "@/constants/defaultRoles";
import { Button } from "@/components/ui/button";
import Loading from "@/app/components/loading.component";
import { useQuery } from "react-query";
import { DynamicTable } from "@/app/components/tables/dynamicTable.component";
import { IUser } from "@/interfaces/IUser";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { CaretSortIcon } from "@radix-ui/react-icons";

interface RegisterPageProps {
  params: {};
}

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
  onEditRow?: (user: IUser) => void;
  onDeleteRow?: (user: IUser) => void;
  setSelectedRows: React.Dispatch<React.SetStateAction<string[]>>;
}

export const columnsFields = ({
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
          updateSelectedRows(row.original.id, !!value, setSelectedRows);
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
];

// Define the zod schema
const userSchema = z.object({
  name: z.string().nonempty(),
  email: z.string().email("E-mail inválido"),
  phone: z.string(),
  state: z.string(),
  city: z.string(),
  cpf: z
    .string()
    .refine(cpfIsComplete, {
      message: "CPF está incompleto",
    })
    .refine(cpfIsValid, {
      message: "CPF Inválido",
    }),
  role: z.enum(["ADMIN", "CLIENT", "TECHNICIAN", "USER"]),
  password: z.string().optional(),
});

type CreateUserFormData = z.infer<typeof userSchema>;

export default function RegisterPage({ params }: RegisterPageProps) {
  const { createUser, fetchUsers, error, isLoading } = useUsers();
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  const router = useRouter();

  const methods = useForm<CreateUserFormData>({
    resolver: zodResolver(userSchema),
  });

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = methods;

  const selectedState = useWatch({ control, name: "state" });
  const selectedRole = useWatch({ control, name: "role" });

  const { cities, states, filterCities } = useCities(selectedState);

  const {
    isLoading: isLoadingUsers,
    isError,
    error: errorUsers,
    data: users,
  } = useQuery(["users", { role: "CLIENT" }], fetchUsers, {
    keepPreviousData: true, // Keep old data for smoother pagination transitions
  });

  useEffect(() => {
    if (selectedState) {
      filterCities();
    }
  }, [selectedState, filterCities]);

  const onSubmit = (data: CreateUserFormData) => {
    const newUser = {
      ...data,
      clients: selectedRows.map((row) => ({ id: row })),
    };
    if (newUser.name) {
      createUser(newUser); // You will need to adjust the createUser function to handle FormData
    }
    router.push("/admin/usuarios");
  };

  if (error) return <div>An error has occurred: {error.message}</div>;

  return (
    <div className="flex-1 items-center justify-center text-zinc-900">
      <div className="pb-2 text-xl font-bold">Cadastrar Usuário</div>
      <FormProvider {...methods}>
        <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-row flex-wrap">
            <Input.Root className="basis-4/12 p-3">
              <Input.Label>Nome:</Input.Label>
              <Input.Controller register={register("name")} type="text" />
              <Input.Error>
                {errors.name && <p>{errors.name.message?.toString()}</p>}
              </Input.Error>
            </Input.Root>
            <Input.Root className="basis-4/12 p-3">
              <Input.Label>E-mail:</Input.Label>
              <Input.Controller register={register("email")} type="email" />
              <Input.Error>
                {errors.email && <p>{errors.email.message?.toString()}</p>}
              </Input.Error>
            </Input.Root>

            <Input.Root className="basis-4/12 p-3">
              <Input.Label>Telefone:</Input.Label>
              <Input.MaskedController
                register={register("phone")}
                mask="(99) 99999-9999"
              />
              <Input.Error>
                {errors.phone && <p>{errors.phone.message?.toString()}</p>}
              </Input.Error>
            </Input.Root>
            <Input.Root className="basis-4/12 p-3">
              <Input.Label>CPF:</Input.Label>
              <Input.MaskedController
                register={register("cpf")}
                mask="999.999.999-99"
              />
              <Input.Error>
                {errors.cpf && <p>{errors.cpf.message?.toString()}</p>}
              </Input.Error>
            </Input.Root>
            <Input.Root className="basis-4/12 p-3">
              <Input.Label>Estado:</Input.Label>
              <Input.SelectController name="state" options={states} />
              <Input.Error>
                {errors.state && <p>{errors.state.message?.toString()}</p>}
              </Input.Error>
            </Input.Root>
            <Input.Root className="basis-4/12 p-3">
              <Input.Label>Cidade:</Input.Label>
              <Input.SelectController name="city" options={cities} />
              <Input.Error>
                {errors.city && <p>{errors.city.message?.toString()}</p>}
              </Input.Error>
            </Input.Root>
            <Input.Root className="basis-4/12 p-3">
              <Input.Label>Tipo de usuário:</Input.Label>
              <Input.SelectController name="role" options={DEFAULT_ROLES} />
              <Input.Error>
                {errors.role && <p>{errors.role.message?.toString()}</p>}
              </Input.Error>
            </Input.Root>
          </div>
          {selectedRole === "TECHNICIAN" && users && (
            <Input.Root className="flex-1 w-full p-3">
              <Input.Label>
                Selecione os clientes atendidos por este técnico:
              </Input.Label>
              {!isLoadingUsers && (
                <DynamicTable<IUser>
                  data={users}
                  columns={columnsFields({
                    setSelectedRows,
                  })}
                  searchByPlaceholder={"Procurar..."}
                />
              )}
            </Input.Root>
          )}
          <div className="py-3 hover:cursor-pointer">
            {isLoading ? (
              <Loading></Loading>
            ) : (
              <Button
                className="bg-blue-500 w-32 text-white "
                variant={"default"}
                type="submit"
              >
                Salvar
              </Button>
            )}
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
