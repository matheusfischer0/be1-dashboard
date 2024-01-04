"use client";
// React and Next.js imports
import React, { useState, useCallback } from "react";
import { useRouter } from "next/navigation";

// Third-party libraries
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ColumnDef } from "@tanstack/react-table";

// Local imports (hooks, interfaces, components)
import { useServices } from "@/hooks/useServices";
import { useToast } from "@/app/components/toast.component";
import { IServiceOption } from "@/interfaces/IService";
import { DynamicTable } from "@/app/components/tables/dynamicTable.component";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { CaretSortIcon, DotsHorizontalIcon } from "@radix-ui/react-icons";
import EditableCell from "@/app/components/tables/editableCell.component";

import { FiTrash } from "react-icons/fi";

interface IColumnsFieldsProps {
  onEditRow?: (option: IServiceOption) => void;
  onDeleteRow?: (option: IServiceOption) => void;
  onMoveUp?: (option: IServiceOption) => void;
  onMoveDown?: (option: IServiceOption) => void;
}

const columnsFields = ({
  onEditRow,
  onDeleteRow,
  onMoveUp,
  onMoveDown,
}: IColumnsFieldsProps): ColumnDef<IServiceOption>[] => [
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
    header: "Ordem",
    id: "orderActions",
    cell: ({ row }) => {
      if (!onMoveUp || !onMoveDown) return;
      return (
        <div className="flex items-center">
          <Button onClick={() => onMoveUp(row.original)} type="button">
            ↑
          </Button>
          <Button onClick={() => onMoveDown(row.original)} type="button">
            ↓
          </Button>
        </div>
      );
    },
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

interface RegisterPageProps {
  params: {};
}
// Define the zod schema
const ServiceSchema = z.object({
  description: z.string(),
  serviceOptions: z.array(
    z.object({
      id: z.string().optional(), // Optional for new entries
      description: z.string(),
      order: z.number().int(),
    })
  ),
});

type CreateServiceFormData = z.infer<typeof ServiceSchema>;

export default function RegisterPage({ params }: RegisterPageProps) {
  const { createService, error, deleteServiceOption } = useServices();
  // State to manage service options
  const [serviceOptions, setServiceOptions] = useState<IServiceOption[]>([]);
  const [selectedServiceOption, setSelectedServiceOption] =
    useState<IServiceOption>();
  const [newServiceOption, setNewServiceOption] = useState("");

  const router = useRouter();
  const { Toast, openToast } = useToast();

  const methods = useForm<CreateServiceFormData>({
    resolver: zodResolver(ServiceSchema),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = methods;

  const handleAddServiceOption = () => {
    if (newServiceOption.trim()) {
      const newServiceOptions = [
        ...serviceOptions,
        {
          id: Date.now().toString(),
          description: newServiceOption,
          order: serviceOptions.length + 1,
        },
      ];
      setServiceOptions(newServiceOptions);
      setValue("serviceOptions", newServiceOptions);

      setNewServiceOption(""); // Reset the input field after adding
    }
  };

  const handleChange = (updatedOption: IServiceOption) => {
    const newServiceOptions = serviceOptions.map((option) =>
      option.id === updatedOption.id ? updatedOption : option
    );
    setServiceOptions(newServiceOptions);
    setValue("serviceOptions", newServiceOptions);
  };

  const handleConfirmDelete = (serviceOption: IServiceOption) => {
    setSelectedServiceOption(serviceOption);
    openToast(
      `Você tem certeza que deseja excluir ${serviceOption.description}?`,
      () => handleDelete(),
      handleCancelDelete
    );
  };

  const handleDelete = useCallback(() => {
    if (selectedServiceOption?.id) {
      deleteServiceOption(selectedServiceOption.id);
      setServiceOptions((prevOptions) =>
        prevOptions.filter((option) => option.id !== selectedServiceOption.id)
      );
    }
  }, [selectedServiceOption]);

  const handleCancelDelete = useCallback(() => {
    console.log(
      "Delete action canceled for",
      selectedServiceOption?.description
    );
  }, [selectedServiceOption]);

  const handleMoveUp = (serviceOption: IServiceOption) => {
    setServiceOptions((prev) => {
      const index = prev.findIndex((item) => item.id === serviceOption.id);
      if (index > 0) {
        let newOptions = swapElements(prev, index, index - 1);
        // Update the 'order' property
        [newOptions[index - 1].order, newOptions[index].order] = [
          newOptions[index].order,
          newOptions[index - 1].order,
        ];
        return newOptions;
      }
      return prev;
    });
  };

  const handleMoveDown = (serviceOption: IServiceOption) => {
    setServiceOptions((prev) => {
      const index = prev.findIndex((item) => item.id === serviceOption.id);
      if (index < prev.length - 1) {
        let newOptions = swapElements(prev, index, index + 1);
        // Update the 'order' property
        [newOptions[index + 1].order, newOptions[index].order] = [
          newOptions[index].order,
          newOptions[index + 1].order,
        ];
        return newOptions;
      }
      return prev;
    });
  };

  const swapElements = (array: any[], index1: number, index2: number) => {
    const result = [...array];
    [result[index1], result[index2]] = [result[index2], result[index1]];
    return result;
  };

  const onSubmit = async (data: CreateServiceFormData) => {
    const serviceData = {
      ...data,
      serviceOptions: serviceOptions.map((option) => ({
        description: option.description,
        order: option.order,
      })),
    };
    if (serviceData.description && serviceData.serviceOptions.length > 0) {
      createService(serviceData);
      router.push("/admin/configuracoes/servicos");
    } else {
      console.log("Campos inválidos");
    }
  };

  if (error) return <div>An error has occurred: {error.message}</div>;

  return (
    <div className="flex-1 items-center justify-center text-zinc-900 px-3 py-8">
      <Toast />
      <div className="text-xl font-medium pb-4">Cadastrar Serviço</div>
      <FormProvider {...methods}>
        <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col w-full gap-4">
            <div className="grow">
              <div className="grow">
                <label>Descrição:</label>
                <Input
                  placeholder="Digite aqui o nome do serviço"
                  type="text"
                  {...register("description")}
                />
                <div className="text-red-500 text-md">
                  {errors.description && (
                    <p>{errors.description.message?.toString()}</p>
                  )}
                </div>
              </div>
            </div>
            <div className="grow">
              <div className="text-md font-medium pb-4">Subserviços</div>
              <div className="flex items-center pb-3 gap-3 ">
                <Input
                  placeholder="Escreva uma breve descrição do subserviço"
                  value={newServiceOption}
                  onChange={(e) => setNewServiceOption(e.target.value)}
                  type="text"
                />
                <Button
                  variant={"primary"}
                  onClick={handleAddServiceOption}
                  className="w-44"
                  type="button"
                >
                  Adicionar Subserviço
                </Button>
              </div>
              {serviceOptions && serviceOptions.length > 0 && (
                <DynamicTable<IServiceOption>
                  data={serviceOptions}
                  columns={columnsFields({
                    onEditRow: handleChange,
                    onDeleteRow: handleConfirmDelete,
                    onMoveUp: handleMoveUp,
                    onMoveDown: handleMoveDown,
                  })}
                  // Add any additional props or handlers needed for editing/deleting options
                />
              )}
            </div>
          </div>

          <div className="flex justify-end py-4 ">
            <Button
              className={`bg-gradient-to-r from-blue-600 to-blue-400 rounded-md px-4 text-white w-44 justify-center`}
              type="submit"
            >
              Salvar
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
