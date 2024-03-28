"use client";

import { useEffect, useState } from "react";

import { z } from "zod";
import { FormProvider, useForm } from "react-hook-form";
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
import { useUser } from "@/hooks/useUser";
import Spacer from "@/app/components/spacer.component";
import { http } from "@/lib/http-common";
import { useToast } from "@/app/components/toast.component";

import { Input } from "@/components/ui/input";

import Select from "react-select";
import { useProducts } from "@/hooks/useProducts";
import { formatDate } from "@/lib/date-functions";
import Loading from "@/app/components/loading.component";

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
const editUserSchema = z.object({
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
  clients: z.array(z.object({ id: z.string().nonempty("Id é obrigatório") })),
  products: z.array(
    z.object({
      product: z.object({ name: z.string() }),
      warrantyFinalDate: z.string(),
      orderNumber: z.string(),
    })
  ),
  password: z.string().optional(),
});

type EditUserFormData = z.infer<typeof editUserSchema>;

interface IClientsColumnsFieldsProps {
  onEditRow?: (user: IUser) => void;
  onDeleteRow?: (user: IUser) => void;
  setSelectedRows?: React.Dispatch<React.SetStateAction<string[]>>;
}

const linkClientsColumnsFields = ({
  onEditRow,
  onDeleteRow,
  setSelectedRows,
}: IClientsColumnsFieldsProps): ColumnDef<IUser>[] => [
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
          setSelectedRows &&
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

interface IProductsColumnsFieldsProps {
  onEditRow?: (product: IProductOnClient) => void;
  onDeleteRow?: (product: IProductOnClient) => void;
  setSelectedRows?: React.Dispatch<React.SetStateAction<string[]>>;
}

const linkProductsColumnsFields = ({
  onEditRow,
  onDeleteRow,
  setSelectedRows,
}: IProductsColumnsFieldsProps): ColumnDef<IProductOnClient>[] => [
  {
    accessorKey: "product",
    header: "Produtos",
    cell: ({ row }) => {
      const product = row.getValue("product") as { name: string };
      return <div className="capitalize">{product?.name}</div>;
    },
  },
  {
    accessorKey: "orderNumber",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Número do pedido
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div className="">{row.getValue("orderNumber")}</div>,
  },
  {
    accessorKey: "warrantyFinalDate",
    enableHiding: true,
    header: "Garantia até",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("warrantyFinalDate")}</div>
    ),
  },
  {
    accessorKey: "actions",
    header: "Remover",
    cell: ({ row }) => (
      <Button
        className="p-0"
        variant="ghost"
        onClick={() => onDeleteRow && onDeleteRow(row.original)}
        type="button"
      >
        <FiTrash className="text-red-500" size={22} />
      </Button>
    ),
  },
];

interface AddNewProductToClient {
  productId: string;
  clientId: string;
  warrantyFinalDate: string;
  orderNumber: string;
}

interface EditUserPageProps {
  params: { id: string };
}

const EditUserPage = ({ params }: EditUserPageProps) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { Toast, openToast } = useToast();

  const { products } = useProducts();
  const { user, isLoading: isLoadingUsers } = useUser(params.id);
  const { fetchUsers } = useUsers();

  const { data: users } = useQuery(["users", { role: "CLIENT" }], fetchUsers, {
    keepPreviousData: true,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  // Handle Add new Product to Client
  const [orderNumber, setOrderNumber] = useState<string>();
  const [warrantyFinalDate, setWarrantyFinalDate] = useState<string>();
  const [selectedProduct, setSelectedProduct] = useState<string>();
  const activeValueProduct = products?.find(
    (product) => product.id === selectedProduct
  );
  const activeProduct = activeValueProduct
    ? { value: activeValueProduct.id, label: activeValueProduct.name }
    : null;

  const methods = useForm<EditUserFormData>({
    resolver: zodResolver(editUserSchema),
    reValidateMode: "onChange",
  });

  const {
    control,
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = methods;

  useEffect(() => {
    if (user) {
      setValue("name", user.name);
      setValue("email", user.email);
      setValue("role", user.role);
      if (user.cpf) setValue("cpf", user.cpf);
      if (user.state) setValue("state", user.state);
      if (user.city) setValue("city", user.city);
      if (user.phone) setValue("phone", user.phone);
      if (user.state) setValue("state", user.state);
      if (user.city) setValue("city", user.city);
      if (user.clients) {
        // Set initial selected rows based on user's clients
        setValue("clients", user.clients);
        const clientIds = user.clients?.map((client) => client.id);
        setSelectedRows(clientIds);
      }
      if (user.products) {
        // Set initial selected rows based on user's clients
        setValue("products", user.products);
      }
    }
  }, [user, params, setValue]);

  const selectedRole = watch("role");

  const selectedState = watch("state");
  const { cities, states } = useCities(selectedState);

  const handleAddProductToClient = async () => {
    if (!warrantyFinalDate) return;
    if (!orderNumber) return;
    if (!selectedProduct) return;

    const formattedDate = formatDate(warrantyFinalDate);

    const data = {
      productId: selectedProduct,
      clientId: params.id,
      orderNumber,
      warrantyFinalDate: formattedDate,
    };

    await http.post("/products/add-to-client", data);
    queryClient.invalidateQueries("user");
  };

  const handleRemoveProductFromClient = async (data: IProductOnClient) => {
    openToast(
      `Você tem certeza que deseja excluir o produto ${data?.product.name} (Número de pedido: ${data?.orderNumber})?`,
      () => handleConfirmRemoveProductFromClient(data),
      () => {}
    );
  };

  const handleConfirmRemoveProductFromClient = async (
    data: IProductOnClient
  ) => {
    await http.post("/products/remove-from-client", data);
    queryClient.invalidateQueries("user");
  };

  const onSubmit = async (data: EditUserFormData) => {
    console.log("onSubmit", {
      ...data,
      clients: selectedRows.map((id) => ({ id })),
    });
    setIsLoading(true);
    try {
      await http.post(`/users/update/${params.id}`, {
        ...data,
        clients: selectedRows.map((id) => ({ id })),
      });
      // Handle success (e.g., show a success message or redirect)
      toast.success("Sucesso ao editar o usuário");
      setIsLoading(false);

      router.push("/admin/usuarios");
    } catch (error) {
      // Handle error (e.g., show an error message)
      const err = error as AxiosError<{ message: string }>;
      toast.error(`Erro ao Salvar o usuário!  ${err.response?.data.message}`);
      setIsLoading(false);

      console.log(error);
    }
  };

  if (isLoadingUsers) {
    <Loading></Loading>;
  }

  return (
    <>
      <Toast />
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-2 pt-2"
        >
          <div className="flex w-full justify-between">
            <h2 className="text-black text-xl">Editar usuário</h2>
          </div>
          <Spacer />
          {/* Input fields for each attribute, including masked inputs for phone and CPF */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 ">
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
              <CustomSelect
                name="city"
                options={cities}
                className="text-black"
              />
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
          <Spacer />

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

          {selectedRole === "CLIENT" && (
            <div className="flex flex-col gap-2">
              <label className="text-zinc-800 text-xl px-1">Produtos</label>
              <label className="flex items-center gap-1 text-zinc-700 px-1">
                <FiInfo></FiInfo>Adicione os produtos que o cliente possui
              </label>
              <div>
                <div className="flex flex-row flex-wrap pb-3 gap-3 ">
                  <Select
                    styles={{
                      control: () => ({
                        display: "flex",
                        border: "none",
                        padding: 0,
                      }),
                    }}
                    placeholder="Selecione o produto"
                    options={products?.map((product) => ({
                      value: product.id,
                      label: product.name,
                    }))}
                    value={activeProduct}
                    onChange={(val) => {
                      if (val) setSelectedProduct(val.value);
                    }}
                    className={
                      "max-w-[20rem] w-full border border-gray-200 rounded-md px-1 focus:border-white text-black"
                    }
                  />
                  <div className="flex flex-1 min-w-[6rem]">
                    <Input
                      className="text-black"
                      placeholder="Digite o número do pedido"
                      value={orderNumber}
                      onChange={(e) => setOrderNumber(e.target.value)}
                      type="text"
                    />
                  </div>
                  <div className="">
                    <Input
                      className="text-black"
                      value={warrantyFinalDate}
                      onChange={(e) => setWarrantyFinalDate(e.target.value)}
                      type="date"
                    />
                  </div>
                  <Button
                    variant={"primary"}
                    onClick={() => handleAddProductToClient()}
                    className="w-fit"
                    type="button"
                  >
                    Adicionar
                  </Button>
                </div>
              </div>
              <DynamicTable<IProductOnClient>
                data={user?.products || []}
                columns={linkProductsColumnsFields({
                  onDeleteRow: handleRemoveProductFromClient,
                })}
              />
            </div>
          )}

          <div className="flex w-full justify-end">
            <Button
              variant={"primary"}
              disabled={isLoading}
              type="submit"
              className="bg-blue-500 w-fit text-white py-2 px-8 shadow-md"
            >
              Salvar usuário
            </Button>
          </div>
        </form>
      </FormProvider>
    </>
  );
};

export default EditUserPage;
