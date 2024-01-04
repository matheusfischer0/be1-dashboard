"use client";

import { useState } from "react";

import { z } from "zod";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import InputMask from "react-input-mask";
import { DEFAULT_ROLES, IRole } from "@/constants/defaultRoles";
import { useCities } from "@/hooks/useCities";
import CustomSelect from "@/app/components/Input/CustomSelect";
import { cpfIsComplete, cpfIsValid } from "@/lib/cpf-validator";
import toast from "react-hot-toast";
import useAxiosAuth from "@/hooks/useAxiosAuth";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useUsers } from "@/hooks/useUsers";
import { useQuery, useQueryClient } from "react-query";
import { DynamicTable } from "@/app/components/tables/dynamicTable.component";
import { Checkbox } from "@/components/ui/checkbox";
import { CaretSortIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import { updateSelectedRows } from "@/lib/utils";
import { IProductOnClient, IUser } from "@/interfaces/IUser";
import { ColumnDef } from "@tanstack/react-table";
import { zodResolver } from "@hookform/resolvers/zod";
import { FiInfo, FiTrash } from "react-icons/fi";
import { http } from "@/lib/http-common";

interface Location {
  latitude: number;
  longitude: number;
}

interface ICreateUserDTO {
  id?: string;
  name: string;
  phone?: string;
  state?: string;
  city?: string;
  email: string;
  cpf: string;
  password: string;
  avatar?: string;
  role?: IRole;
  location?: Omit<Location, "id" | "address">;
  clients?: { id: string }[];
}

// Define the zod schema
const createUserSchema = z.object({
  name: z
    .string()
    .nonempty("Campo obrigatório")
    .refine((value) => {
      return value.split(" ").length > 1;
    }, "Cadastre um nome e sobrenome"),
  email: z.string().email("E-mail inválido"),
  phone: z.string(),
  state: z.string().nonempty("Campo obrigatório"),
  city: z.string().nonempty("Campo obrigatório"),
  cpf: z
    .string()
    .refine(cpfIsComplete, {
      message: "CPF está incompleto",
    })
    .refine(cpfIsValid, {
      message: "CPF Inválido",
    }),
  role: z.enum(["ADMIN", "CLIENT", "TECHNICIAN", "USER"]),
  clients: z
    .array(
      z.object({
        id: z.string().nonempty("Id é obrigatório"),
        name: z.string(),
      })
    )
    .optional(),

  password: z.string().optional(),
});

type CreateUserFormData = z.infer<typeof createUserSchema>;

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

const CreateUserPage = () => {
  const router = useRouter();
  const api = useAxiosAuth();
  const queryClient = useQueryClient();

  const { fetchUsers } = useUsers();

  const { data: users } = useQuery(["users", { role: "CLIENT" }], fetchUsers, {
    keepPreviousData: true,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  const methods = useForm<CreateUserFormData>({
    resolver: zodResolver(createUserSchema),
    reValidateMode: "onSubmit",
  });

  const {
    control,
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = methods;

  const {
    fields: clients,
    append: appendClient,
    remove: removeClient,
  } = useFieldArray({
    control, // control props comes from useForm (optional: if you are using FormContext)
    name: "clients", // unique name for your Field Array
  });

  const selectedRole = watch("role");

  const selectedState = watch("state");
  const { cities, states } = useCities(selectedState);

  const onSubmit = async (data: CreateUserFormData) => {
    setIsLoading(true);
    try {
      await api.post("/users/create", {
        ...data,
        clients: selectedRows.map((id) => ({ id })),
      });
      // Handle success (e.g., show a success message or redirect)
      toast.success("Sucesso ao criar o usuário");
      router.push("/admin/usuarios");
    } catch (error) {
      // Handle error (e.g., show an error message)
      const err = error as AxiosError<{ message: string }>;
      toast.error(`Erro ao criar o usuário!  ${err.response?.data.message}`);
      console.log(error);
    }
    setIsLoading(false);
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div className="">
          <h2 className="text-black text-xl">Cadasto de usuário</h2>
        </div>
        {/* Input fields for each attribute, including masked inputs for phone and CPF */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
          {/* Name Field */}
          <div className="flex flex-col gap-1">
            <label className="text-zinc-700 px-1">Nome</label>
            <input
              {...register("name", { required: true })}
              className="w-full p-2 border rounded text-black"
            />
            {errors.name && (
              <span className="text-red-500">{errors.name.message}</span>
            )}
          </div>

          {/* Phone Field */}
          <div className="flex flex-col gap-1">
            <label className="text-zinc-700 px-1">Telefone</label>
            <InputMask
              className="w-full p-2 border rounded text-black"
              mask="(99) 99999-9999"
              placeholder="(XX) 99999-9999"
              {...register("phone")}
            />
          </div>

          {/* State Field */}
          <div className="flex flex-col gap-1">
            <label className="text-zinc-700 px-1">Estado</label>
            <CustomSelect
              name="state"
              options={states}
              className="w-full border rounded"
            />
            {errors.state && (
              <span className="text-red-500">Campo obrigatório</span>
            )}
          </div>

          {/* City Field */}
          <div className="flex flex-col gap-1">
            <label className="text-zinc-700 px-1">Cidade</label>
            <CustomSelect name="city" options={cities} className="text-black" />
            {errors.city && (
              <span className="text-red-500">Campo obrigatório</span>
            )}
          </div>

          {/* Email Field */}
          <div className="flex flex-col gap-1">
            <label className="text-zinc-700 px-1">E-mail</label>
            <input
              {...register("email", {
                required: { value: true, message: "O e-mail é obrigatório" },
              })}
              placeholder="E-mail"
              className="w-full p-2 px-3 border rounded text-black"
            />
            {errors.email && (
              <span className="text-red-500">{errors.email.message}</span>
            )}
          </div>

          {/* CPF Field */}
          <div className="flex flex-col gap-1">
            <label className="text-zinc-700 px-1">CPF</label>
            <InputMask
              className="w-full p-2 border rounded text-black"
              mask="999.999.999-99"
              placeholder="999.999.999-99"
              {...register("cpf", {
                required: { value: true, message: "Campo Obrigatório" },
                validate: {
                  cpfIsValue: (v) => cpfIsValid(v) || "CPF Inválido",
                },
              })}
            ></InputMask>
            {errors.cpf && (
              <span className="text-red-500">{errors.cpf.message}</span>
            )}
          </div>
          {/* ROLE Field */}
          {/* DEFAULT_ROLES */}
          <div className="flex flex-col gap-1">
            <label className="text-zinc-700 px-1">Tipo de usuário</label>
            <CustomSelect
              name="role"
              options={DEFAULT_ROLES}
              className="text-black"
            />
            {errors.role && (
              <span className="text-red-500">Campo obrigatório</span>
            )}
          </div>
          {/* Password Field */}
          <div className="flex flex-col gap-1">
            <label className="text-zinc-700 px-1">Senha</label>
            <input
              id={"password"}
              autoComplete="password"
              type="password"
              {...register("password")}
              placeholder="Digite uma nova senha para o cliente"
              className="w-full p-2 border rounded text-black"
            />
            {errors.password && (
              <span className="text-red-500">Este campo é obrigatório</span>
            )}
          </div>
        </div>
        {selectedRole === "TECHNICIAN" && (
          <div className="flex flex-col gap-2">
            <label className="text-zinc-800 text-xl px-1">Clientes</label>
            <label className="flex items-center gap-1 text-zinc-700 px-1">
              <FiInfo></FiInfo>Selecione todos os clientes que o assistente
              atende
            </label>
            <DynamicTable<IUser>
              data={users || []}
              selectedRows={selectedRows}
              columns={linkClientsColumnsFields({ setSelectedRows })}
              searchByPlaceholder="Procure o cliente"
            />
          </div>
        )}
        <div className="flex w-full justify-end">
          <button
            disabled={isLoading}
            type="submit"
            className="bg-blue-500 w-fit text-white rounded-full py-2 px-6 shadow-md"
          >
            Criar usuário
          </button>
        </div>
      </form>
    </FormProvider>
  );

  // Implementation will go here
};

export default CreateUserPage;
