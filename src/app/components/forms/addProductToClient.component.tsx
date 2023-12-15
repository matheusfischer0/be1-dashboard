import React, { useState } from "react";
import { IProductOnClient } from "@/interfaces/IUser";
import { z } from "zod";
import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { CaretSortIcon } from "@radix-ui/react-icons";
import { useProducts } from "@/hooks/useProducts";
import { DynamicTable } from "../tables/dynamicTable.component";
import { Input } from "@/components/ui/input";
import InputMask from "react-input-mask";

import Select, { Props as SelectProps } from "react-select";
import { twMerge } from "tailwind-merge";
import { formatDate } from "@/lib/date-functions";

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

// import { Container } from './styles';

interface AddProductToClientFormProps {
  productsOnClient?: IProductOnClient[];
  showLabel?: boolean;
}

// Define the zod schema
const productsSchema = z.object({
  product: z.object({ name: z.string() }),
  warrantyFinalDate: z.string(),
  orderNumber: z.string(),
});

type AddProductToClientFormData = z.infer<typeof productsSchema>;

interface IColumnsFieldsProps {
  onEditRow?: (product: IProductOnClient) => void;
  onDeleteRow?: (product: IProductOnClient) => void;
  setSelectedRows: React.Dispatch<React.SetStateAction<string[]>>;
}

const linkProductsColumnsFields = ({
  onEditRow,
  onDeleteRow,
  setSelectedRows,
}: IColumnsFieldsProps): ColumnDef<IProductOnClient>[] => [
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
];

export function AddProductToClientForm({
  productsOnClient,
}: AddProductToClientFormProps) {
  const { products } = useProducts();
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [orderNumber, setOrderNumber] = useState<string>();
  const [warrantyFinalDate, setWarrantyFinalDate] = useState<string>();

  const [selectedProduct, setSelectedProduct] = useState<string>();

  const activeValueProduct = products?.find(
    (product) => product.id === selectedProduct
  );

  const activeProduct = activeValueProduct
    ? { value: activeValueProduct.id, label: activeValueProduct.name }
    : null;

  const handleAddProductToClient = () => {
    if (!warrantyFinalDate) return;
    if (!orderNumber) return;
    if (!selectedProduct) return;

    const formattedDate = formatDate(warrantyFinalDate);
    console.log({
      id: selectedProduct,
      orderNumber,
      warrantyFinalDate: formattedDate,
    });
  };

  return (
    <div>
      <div className="flex items-center pb-3 gap-3 ">
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
            "w-full border border-gray-200 rounded-md py-0.5 px-2 focus:border-white"
          }
        />

        <Input
          placeholder="Digite o número do pedido"
          value={orderNumber}
          onChange={(e) => setOrderNumber(e.target.value)}
          type="text"
        />
        <Input
          placeholder="Digite o número do pedido"
          value={warrantyFinalDate}
          onChange={(e) => setWarrantyFinalDate(e.target.value)}
          type="date"
        />
        <Button
          variant={"primary"}
          onClick={() => handleAddProductToClient()}
          className="w-44"
          type="button"
        >
          Adicionar Produto
        </Button>
      </div>
      {productsOnClient && (
        <div>
          <DynamicTable<IProductOnClient>
            data={productsOnClient}
            columns={linkProductsColumnsFields({
              onEditRow: () => {},
              onDeleteRow: () => {},
              setSelectedRows,
            })}
          />
        </div>
      )}
    </div>
  );
}
