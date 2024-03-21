"use client";

import MonthlyAssistanceChart from "@/app/components/charts/MonthlyAssistanceChart";
import { DynamicTable } from "@/app/components/tables/dynamicTable.component";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { useAssistanceCounters } from "@/hooks/useAssistanceCounters";
import { useAssistances } from "@/hooks/useAssistances";
import { IAssistance } from "@/interfaces/IAssistance";
import { formatDate } from "@/lib/date-functions";
import {
  textStatusColors,
  textStatusPortugueseColors,
} from "@/utils/chartUtilsFunctions";

import { CaretSortIcon } from "@radix-ui/react-icons";
import { ColumnDef } from "@tanstack/react-table";

const columnsFields = (): ColumnDef<IAssistance>[] => [
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
    cell: ({ row }) => {
      const value = row.getValue("status") as string;
      const textColor = textStatusPortugueseColors[value];

      return (
        <div className={`capitalize ${textColor}`}>
          {row.getValue("status")}
        </div>
      );
    },
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
    header: ({ column }) => {
      return (
        <div className="flex justify-end">
          <Button
            className="p-0"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            <div className="flex">
              Data de criação
              <CaretSortIcon className="ml-2 h-4 w-4" />
            </div>
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      const parsedDate = formatDate(row.getValue("createdAt"));

      return <div className="text-right font-medium">{parsedDate}</div>;
    },
    enableSorting: true,
  },
];

export default function Admin() {
  const { assistances, isLoading, error } = useAssistances();
  const { assistanceCounters } = useAssistanceCounters();

  return (
    <div className="">
      <div className="flex flex-col gap-6">
        <Card className="p-4 w-fit">
          <div>
            <h3 className="text-black">Assistências por status</h3>
          </div>
          <div className="flex flex-row flex-wrap gap-6 mt-4">
            {assistanceCounters &&
              Object.entries(assistanceCounters)
                .filter(
                  ([statusKey, _]) =>
                    statusKey !== "ANALYSING" && statusKey !== "CREATED"
                )
                .map(([statusKey, { label, count }]) => {
                  return (
                    <Card key={statusKey} className={`border rounded-xl w-fit`}>
                      <CardTitle className="p-4 pb-0">
                        <h2
                          className={`text-lg font-bold ${textStatusColors[statusKey]}`}
                        >
                          {label}
                        </h2>
                      </CardTitle>
                      <CardContent className="flex-1 p-4 pt-0">
                        <p className="text-black">{count} Chamados</p>
                      </CardContent>
                    </Card>
                  );
                })}
          </div>
        </Card>

        <div className="hidden md:block">
          <Card className="p-4">
            <MonthlyAssistanceChart />
          </Card>
        </div>
        <div className="hidden md:block">
          <Card className="p-4">
            <div>
              <h3 className="text-black">Últimas assistências</h3>
            </div>
            {assistances && (
              <DynamicTable<IAssistance>
                data={assistances}
                columns={columnsFields()}
                searchByPlaceholder="Procurar..."
              />
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
