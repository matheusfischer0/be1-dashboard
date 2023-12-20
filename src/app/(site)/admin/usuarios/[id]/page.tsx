"use client";

import React, { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/app/components/inputs.component";
import { useRouter } from "next/navigation";
import { useCities } from "@/hooks/useCities";
import { useUser } from "@/hooks/useUser";
import { useUsers } from "@/hooks/useUsers";
import { cpfIsComplete, cpfIsValid } from "@/lib/cpf-validator";
import { DEFAULT_ROLES } from "@/constants/defaultRoles";
import { useQuery, useQueryClient } from "react-query";
import { http } from "@/lib/http-common";
import Loading from "@/app/components/loading.component";
import { Button } from "@/components/ui/button";
import { DynamicTable } from "@/app/components/tables/dynamicTable.component";
import { IProductOnClient, IUser } from "@/interfaces/IUser";
import { ColumnDef, RowSelectionState } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { CaretSortIcon } from "@radix-ui/react-icons";
import { AddProductToClientForm } from "@/app/components/forms/addProductToClient.component";

interface EditPageProps {
  params: { id: string };
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

const linkClientsColumnsFields = ({
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
  clients: z.array(z.object({ id: z.string() })),
  cpf: z
    .string()
    .refine(cpfIsComplete, {
      message: "CPF está incompleto",
    })
    .refine(cpfIsValid, {
      message: "CPF Inválido",
    }),
  role: z.enum(["ADMIN", "CLIENT", "TECHNICIAN", "USER"]),
});

type UpdateUserFormData = z.infer<typeof userSchema>;

interface AddNewProductToClient {
  productId: string;
  clientId: string;
  warrantyFinalDate: string;
  orderNumber: string;
}

export default function EditPage({ params }: EditPageProps) {
  const queryClient = useQueryClient();
  const { user, isLoading: isLoadingUpdate, error } = useUser(params.id);
  const { fetchUsers } = useUsers();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  const {
    isLoading: isLoadingUsers,
    error: errorUsers,
    data: users,
  } = useQuery(["users", { role: "CLIENT" }], fetchUsers, {
    keepPreviousData: true, // Keep old data for smoother pagination transitions
  });

  const methods = useForm<UpdateUserFormData>({
    resolver: zodResolver(userSchema),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    getValues,
  } = methods;

  const selectedState = watch("state");
  const { cities, states, filterCities } = useCities(selectedState);

  useEffect(() => {
    if (selectedState) {
      filterCities();
    }
  }, [selectedState, filterCities]);

  useEffect(() => {
    if (user) {
      console.log("setup", user);
      setValue("name", user.name);
      setValue("email", user.email);
      if (user.cpf) setValue("cpf", user.cpf);
      if (user.state) setValue("state", user.state);
      if (user.city) setValue("city", user.city);
      if (user.phone) setValue("phone", user.phone);
      if (user.state) setValue("state", user.state);
      if (user.city) setValue("city", user.city);
      if (user.clients) {
        setValue("clients", user.clients);
        // Set initial selected rows based on user's clients
        const clientIds = user.clients.map((client) => client.id);
        setSelectedRows(clientIds);
      }
      setValue("role", user.role);
    }
  }, [user, states, cities, params, setValue]);

  if (error) return <div>An error has occurred: {error.message}</div>;

  const onSubmit = async (data: UpdateUserFormData) => {
    setIsLoading(true);
    if (data.name && user?.id) {
      const updatedUser = {
        ...user,
        ...data,
        clients: mapSelectedRows(selectedRows),
      };

      http
        .post(`/users/update/${user.id}`, updatedUser)
        .then((response) => {
          console.log(response.data);
        })
        .finally(() => {
          setIsLoading(false);
          router.push("/admin/usuarios");
        });
    }
  };

  const handleAddProductToClient = async (data: AddNewProductToClient) => {
    await http.post("/products/add-to-client", data);
    queryClient.invalidateQueries("user");
  };

  const handleRemoveProductFromClient = async (data: IProductOnClient) => {
    await http.post("/products/remove-from-client", data);
    queryClient.invalidateQueries("user");
  };

  const mapSelectedRows = (data: string[]) => {
    return data.map((item) => ({ id: item }));
  };

  return (
    <div className="flex-1 items-center justify-center text-zinc-900">
      <div className="pb-2 text-xl font-bold">Editar Usuário</div>

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
          {user?.role === "TECHNICIAN" && users && (
            <Input.Root className="flex-1 w-full p-3">
              <Input.Label>
                Selecione os clientes atendidos por este técnico:
              </Input.Label>
              {!isLoadingUsers && (
                <DynamicTable<IUser>
                  data={users}
                  columns={linkClientsColumnsFields({
                    setSelectedRows,
                  })}
                  selectedRows={selectedRows}
                  searchByPlaceholder={"Procurar..."}
                />
              )}
            </Input.Root>
          )}
          {!isLoadingUsers ? (
            user?.role === "CLIENT" &&
            users && (
              <>
                <h3 className="text-lg text-black mb-2">
                  Adicione produtos ao cliente:
                </h3>
                <AddProductToClientForm
                  clientId={user.id}
                  productsOnClient={user.products}
                  onAddNewProductToClient={handleAddProductToClient}
                  onRemoveProductFromClient={handleRemoveProductFromClient}
                />
              </>
            )
          ) : (
            <Loading></Loading>
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
