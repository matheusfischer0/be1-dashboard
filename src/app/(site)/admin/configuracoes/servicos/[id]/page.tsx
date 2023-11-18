"use client";

import React, { useCallback, useEffect, useState } from "react";
import { z } from "zod";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useService } from "@/hooks/useService";
import { DynamicTable } from "@/app/components/tables/dynamicTable.component";
import { IServiceOption } from "@/interfaces/IService";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { CaretSortIcon, DotsHorizontalIcon } from "@radix-ui/react-icons";

import { useServices } from "@/hooks/useServices";
import { useToast } from "@/app/components/toast.component";
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

interface EditPageProps {
  params: { id: string };
}

// Define the zod schema
const Serviceschema = z.object({
  id: z.string(),
  description: z.string(),
  serviceOptions: z.array(
    z.object({
      id: z.string().optional(), // Optional for new entries
      description: z.string(),
      order: z.number().int().optional(),
    })
  ),
});

type EditServiceFormData = z.infer<typeof Serviceschema>;

export default function EditPage({ params }: EditPageProps) {
  const { service, updateService, refetchService, isLoading, error } =
    useService(params.id);
  const { deleteServiceOption } = useServices();

  const [serviceOptions, setServiceOptions] = useState<IServiceOption[]>([]);
  const [selectedServiceOption, setSelectedServiceOption] =
    useState<IServiceOption>();
  const [newServiceOption, setNewServiceOption] = useState("");

  const router = useRouter();
  const { Toast, openToast } = useToast();

  const methods = useForm<EditServiceFormData>({
    resolver: zodResolver(Serviceschema),
    reValidateMode: "onChange",
  });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = methods;

  useEffect(() => {
    if (service) {
      setValue("id", service.id);
      setValue("description", service.description);
      if (service.serviceOptions) {
        setValue("serviceOptions", service.serviceOptions);
        setServiceOptions(service.serviceOptions);
      }
    }
  }, [service, params, setValue]);

  const handleAddServiceOption = () => {
    if (newServiceOption.trim()) {
      const newServiceOptions = [
        ...serviceOptions,
        {
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

  const onSubmit = async (data: EditServiceFormData) => {
    const serviceData = { ...service, ...data, serviceOptions };
    if (serviceData.description && serviceData.serviceOptions.length > 0) {
      updateService(serviceData);
      router.push("/admin/configuracoes/servicos");
    } else {
      console.log("Campos inválidos");
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>An error has occurred: {error.message}</div>;

  return (
    <div className="flex-1 items-center justify-center text-zinc-900">
      <Toast
        message={`Você tem certeza que deseja excluir ${selectedServiceOption?.description}?`}
        onCancel={handleCancelDelete}
        onConfirm={() => handleDelete()}
      />
      <div className="text-xl font-medium pb-4">Editar Serviço</div>
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
