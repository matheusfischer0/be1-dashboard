import React, { useMemo, useState } from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  FilterFn,
  RowSelectionState,
  SortingFn,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFacetedMinMaxValues,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  sortingFns,
  useReactTable,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";

import {
  RankingInfo,
  rankItem,
  compareItems,
} from "@tanstack/match-sorter-utils";

declare module "@tanstack/table-core" {
  interface FilterFns {
    fuzzy: FilterFn<unknown>;
  }
  interface FilterMeta {
    itemRank: RankingInfo;
  }
}

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  // Rank the item
  const itemRank = rankItem(row.getValue(columnId), value);

  // Store the itemRank info
  addMeta({
    itemRank,
  });

  // Return if the item should be filtered in/out
  return itemRank.passed;
};

const fuzzySort: SortingFn<any> = (rowA, rowB, columnId) => {
  let dir = 0;

  // Only sort by rank if the column has ranking information
  if (rowA.columnFiltersMeta[columnId]) {
    dir = compareItems(
      rowA.columnFiltersMeta[columnId]?.itemRank!,
      rowB.columnFiltersMeta[columnId]?.itemRank!
    );
  }

  // Provide an alphanumeric fallback for when the item ranks are equal
  return dir === 0 ? sortingFns.alphanumeric(rowA, rowB, columnId) : dir;
};

interface DynamicTableProps<T extends object> {
  data: T[];
  columns: ColumnDef<T>[];
  selectedRows?: string[];
  searchByPlaceholder?: string;
}

export function DynamicTable<T extends { id?: string }>({
  data,
  columns,
  selectedRows = [],
  searchByPlaceholder,
}: DynamicTableProps<T>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [globalFilter, setGlobalFilter] = useState("");
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(8); // You can adjust the default page size

  // Convert selectedRows array to RowSelectionState format
  const initialRowSelectionState = useMemo(() => {
    return selectedRows.reduce((acc, rowId) => {
      const rowIndex = data.findIndex((item) => item.id === rowId);
      acc[rowIndex] = true;
      return acc;
    }, {} as RowSelectionState);
  }, [selectedRows, data]);

  const tableInstance = useReactTable({
    data,
    columns,
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilters,
    globalFilterFn: fuzzyFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
    onSortingChange: setSorting,
    enableFilters: true,
    state: {
      sorting,
      globalFilter,
      columnFilters,
      pagination: { pageIndex, pageSize },
      rowSelection: initialRowSelectionState, // Pass the initial row selection state
    },
    // Enable pagination
    manualPagination: false, // Set to true if server-side pagination
    // pageCount: -1, // -1 if server-side pagination
    // Ensure filters are enabled
  });

  return (
    <div className="w-full">
      {searchByPlaceholder && (
        <div className="flex w-1/2 py-4">
          <Input
            type="text"
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder={searchByPlaceholder}
            className="p-2 border rounded-md mb-1"
          />
        </div>
      )}
      <div className="rounded-md border overflow-hidden box-border border-zinc-200 text-black">
        <Table>
          <TableHeader className="bg-gradient-to-r from-zinc-50 to-zinc-100 ">
            {tableInstance.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {tableInstance.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {/* Pagination Controls */}
      <div className="flex items-center flex-col gap-4 md:flex-row md:justify-between mt-4 max-w-7xl mx-auto">
        {/* Pagination Controls */}

        <select
          className=""
          value={pageSize}
          onChange={(e) => {
            setPageIndex(0);
            setPageSize(Number(e.target.value));
          }}
        >
          {[5, 8, 16, 48, 84].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Mostrar {pageSize}
            </option>
          ))}
        </select>
        <span className="order-0 md:order-2 flex items-center gap-2">
          Página{" "}
          <strong>
            {pageIndex + 1} de {tableInstance.getPageCount()}
          </strong>
        </span>
        <div className="flex items-center">
          <Button onClick={() => setPageIndex(0)} disabled={pageIndex === 0}>
            Primeira
          </Button>
          <Button
            onClick={() => setPageIndex((old) => Math.max(old - 1, 0))}
            disabled={pageIndex === 0}
          >
            <ArrowLeft size={18} />
            Anterior
          </Button>
          <Button
            onClick={() => setPageIndex((old) => old + 1)}
            disabled={!tableInstance.getCanNextPage()}
          >
            Próxima
            <ArrowRight size={18} />
          </Button>
          <Button
            onClick={() => setPageIndex(tableInstance.getPageCount() - 1)}
            disabled={!tableInstance.getCanNextPage()}
          >
            Última
          </Button>
        </div>
      </div>
    </div>
  );
}
