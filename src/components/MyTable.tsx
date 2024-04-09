"use client";
import React, { useEffect } from "react";
import {
  IoCaretForwardOutline,
  IoCaretBackOutline,
  IoArrowUpCircle,
} from "react-icons/io5";
import { FaForward, FaBackward } from "react-icons/fa";
import { IoArrowDownCircle } from "react-icons/io5";
import { FaFilter } from "react-icons/fa6";
import { WiCloudRefresh } from "react-icons/wi";
import { useId } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableHeader,
} from "@/components/ui/table";
import {
  Column,
  Table as TableType,
  getCoreRowModel,
  useReactTable,
  flexRender,
  getPaginationRowModel,
  getFilteredRowModel,
  getSortedRowModel,
} from "@tanstack/react-table";
import { MdFilter } from "react-icons/md";
import { format } from "date-fns";

export default function MyTable({
  data,
  columns,
  showFilterBar = true,
}: {
  data: any[];
  columns: any[];
  showFilterBar?: boolean;
}) {
  const id = useId();
  const [showFilter, setShowFilter] = React.useState(false);

  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });
  useEffect(() => {
    table.setPageSize(100);
  }, []);
  return (
    <div className=" dark:text-white flex flex-col items-center space-y-2 w-full justify-between ring-1 ring-slate-500/30 rounded-lg p-2 ">
      <div className={`flex justify-between p-2 w-full `}>
        <div className=" hidden md:flex space-x-2 items-center ">
          <WiCloudRefresh className="animate-ping" />
          <h1 className="text-[10px]">
            Updated : {format(new Date(), "do MMM hh:mm:ss a")}
          </h1>
        </div>
        <button
          onClick={() => setShowFilter((prev) => !prev)}
          className={`cursor-pointer 
            ${showFilterBar ? "" : "hidden"}
            ${showFilter && " bg-indigo-500"} dark:bg-gradient-to-tr ${
            showFilter
              ? " from-pink-600 to-indigo-600 "
              : " from-zinc-600 to-zinc-800"
          } p-2 rounded-md`}
        >
          <FaFilter />
        </button>
      </div>
      <Table className=" overflow-auto">
        <TableHeader className=" border-none">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow
              key={headerGroup.id}
              className=" hover:bg-transparent border-none capitalize text-xs font-light"
            >
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  {...{
                    className: header.column.getCanSort()
                      ? "cursor-pointer select-none text-white/80 hover:text-white/100 transition-all duration-150 ease-in-out"
                      : "",
                    onClick: header.column.getToggleSortingHandler(),
                  }}
                >
                  <div className=" flex flex-col items-center w-full justify-center">
                    <div className=" flex items-center space-x-2 w-full justify-center">
                      <div className=" w-full flex justify-center items-center text-black dark:text-slate-500 text-center">
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                      </div>
                      {{
                        asc: <IoArrowDownCircle />,
                        desc: <IoArrowUpCircle />,
                      }[header.column.getIsSorted() as string] ?? null}
                    </div>
                    {header.column.getCanFilter() ? (
                      <div
                        className={`bg-transparent w-fit justify-center ${
                          showFilter ? "" : "hidden"
                        }`}
                      >
                        <Filter column={header.column} table={table} />
                      </div>
                    ) : null}
                  </div>
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => {
            return (
              <TableRow
                key={row.id}
                className="border-b-[1px] border-b-white/10 hover:bg-slate-600/10"
              >
                {row.getVisibleCells().map((cell, index) => {
                  return (
                    <TableCell
                      key={cell.id}
                      className=" py-2 text-xs font-light min-w-12 md:text-sm"
                    >
                      <div className=" cursor-pointer flex w-full items-center justify-center  capitalize">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </div>
                    </TableCell>
                  );
                })}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      <div
        className={`flex justify-center md:justify-center w-full items-center space-x-4 py-5 ${
          table.getPageCount() > 1 ? "" : "hidden"
        }`}
      >
        <div className=" flex space-x-2 items-center justify-center">
          <button
            className="border rounded p-1"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <FaBackward />
          </button>

          <button
            className="border rounded p-1"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <IoCaretBackOutline />
          </button>
          <span className="flex items-center gap-1">
            <div>Page</div>
            <strong>
              {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </strong>
          </span>
          <button
            className="border rounded p-1"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <IoCaretForwardOutline />
          </button>
          <button
            className="border rounded p-1"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <FaForward />
          </button>
        </div>
        <div className="  space-x-5 hidden md:flex">
          <span className="flex items-center gap-1">
            <div>Page</div>
            <strong>
              {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </strong>
          </span>
          <span className="flex items-center">
            <p>Go to Page</p>
            <input
              type="number"
              className="border px-2 rounded w-16 bg-transparent dark:text-white ml-4"
              defaultValue={table.getState().pagination.pageIndex + 1}
              onChange={(e) => {
                const page = e.target.value ? Number(e.target.value) - 1 : 0;
                table.setPageIndex(page);
              }}
            />
          </span>
        </div>
        <select
          className=" bg-transparent border p-1 rounded text-wrap text-white hidden md:block"
          value={table.getState().pagination.pageSize}
          onChange={(e) => {
            table.setPageSize(Number(e.target.value));
          }}
        >
          {[5, 10].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

function Filter({
  column,
  table,
}: {
  column: Column<any, unknown>;
  table: TableType<any>;
}) {
  const firstValue = table
    .getPreFilteredRowModel()
    .flatRows[0]?.getValue(column.id);

  const columnFilterValue = column.getFilterValue();

  const sortedUniqueValues = React.useMemo(
    () =>
      typeof firstValue === "number"
        ? []
        : Array.from(column.getFacetedUniqueValues().keys()).sort(),
    [column.getFacetedUniqueValues()]
  );

  return typeof firstValue === "number" ? (
    <div>
      <div className="flex space-x-2 justify-center ">
        <DebouncedInput
          type="number"
          min={Number(column.getFacetedMinMaxValues()?.[0] ?? "")}
          max={Number(column.getFacetedMinMaxValues()?.[1] ?? "")}
          value={(columnFilterValue as [number, number])?.[0] ?? ""}
          onChange={(value) =>
            column.setFilterValue((old: [number, number]) => [value, old?.[1]])
          }
          // placeholder={`Min ${
          //   column.getFacetedMinMaxValues()?.[0]
          //     ? `(${column.getFacetedMinMaxValues()?.[0]})`
          //     : ""
          // }`}
          className=" border shadow rounded"
        />
        <DebouncedInput
          type="number"
          min={Number(column.getFacetedMinMaxValues()?.[0] ?? "")}
          max={Number(column.getFacetedMinMaxValues()?.[1] ?? "")}
          value={(columnFilterValue as [number, number])?.[1] ?? ""}
          onChange={(value) =>
            column.setFilterValue((old: [number, number]) => [old?.[0], value])
          }
          // placeholder={`Max ${
          //   column.getFacetedMinMaxValues()?.[1]
          //     ? `(${column.getFacetedMinMaxValues()?.[1]})`
          //     : ""
          // }`}
          className="border shadow rounded w-6"
        />
      </div>
      <div className="h-1" />
    </div>
  ) : (
    <>
      <datalist id={column.id + "list"}>
        {sortedUniqueValues.slice(0, 5000).map((value: any) => (
          <option value={value} key={value} />
        ))}
      </datalist>
      <DebouncedInput
        type="text"
        value={(columnFilterValue ?? "") as string}
        onChange={(value) => column.setFilterValue(value)}
        // placeholder={`Search... (${column.getFacetedUniqueValues().size})`}
        className=" border shadow rounded w-6"
        list={column.id + "list"}
      />
      <div className="h-1" />
    </>
  );
}

// A debounced input react component
function DebouncedInput({
  value: initialValue,
  onChange,
  debounce = 500,
  className,
  ...props
}: {
  value: string | number;
  onChange: (value: string | number) => void;
  className?: string;
  debounce?: number;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange">) {
  const [value, setValue] = React.useState(initialValue);

  React.useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value);
    }, debounce);

    return () => clearTimeout(timeout);
  }, [value]);

  return (
    <input
      {...props}
      className=" dark:text-white text-black bg-transparent py-1 ring-1 ring-slate-500/30 rounded-md my-1 px-2 w-24"
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
}
