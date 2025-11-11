/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import * as React from "react";
import {
  useReactTable,
  getCoreRowModel,
  getExpandedRowModel,
  getFilteredRowModel,
  flexRender,
  getPaginationRowModel,
} from "@tanstack/react-table";
import type { RowPinningState } from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Checkbox } from "../components/ui/checkbox";
import { Label } from "../components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../components/ui/select";
import { Separator } from "../components/ui/separator";
import { Card, CardHeader, CardContent } from "../components/ui/card";

// Import Pagination components from shadcn/ui
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "../components/ui/pagination";

const firstNames = [
  "John",
  "Jane",
  "Mike",
  "Susan",
  "Tom",
  "Emily",
  "Chris",
  "Katie",
];
const lastNames = [
  "Doe",
  "Smith",
  "Johnson",
  "Williams",
  "Brown",
  "Jones",
  "Miller",
  "Davis",
];
const statuses = ["relationship", "complicated", "single"];

const range = (len: number) => Array.from({ length: len }, (_, i) => i);

const newPerson = () => ({
  firstName: firstNames[Math.floor(Math.random() * firstNames.length)],
  lastName: lastNames[Math.floor(Math.random() * lastNames.length)],
  age: Math.floor(Math.random() * 40) + 18,
  visits: Math.floor(Math.random() * 1000),
  progress: Math.floor(Math.random() * 100),
  status: statuses[Math.floor(Math.random() * statuses.length)],
});

function makeData(...lens: number[]) {
  const makeDataLevel = (depth = 0): any[] => {
    const len = lens[depth];
    if (!len) return [];
    return range(len).map(() => ({
      ...newPerson(),
      subRows: lens[depth + 1] ? makeDataLevel(depth + 1) : undefined,
    }));
  };
  return makeDataLevel();
}

export function ShadcnTable() {
  const data = makeData(100, 2, 2);
  const rerender = React.useReducer(() => ({}), {})[1];

  const [rowPinning, setRowPinning] = React.useState<RowPinningState>({
    top: [],
    bottom: [],
  });
  const [expanded, setExpanded] = React.useState({});

  const [keepPinnedRows, setKeepPinnedRows] = React.useState(true);
  const [includeLeafRows, setIncludeLeafRows] = React.useState(true);
  const [includeParentRows, setIncludeParentRows] = React.useState(false);
  const [copyPinnedRows, setCopyPinnedRows] = React.useState(false);

  const columns = React.useMemo(
    () => [
      {
        id: "pin",
        header: "Pin",
        cell: ({ row }: { row: any }) =>
          row.getIsPinned() ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => row.pin(false, includeLeafRows, includeParentRows)}
            >
              ❌
            </Button>
          ) : (
            <div className="flex gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  row.pin("top", includeLeafRows, includeParentRows)
                }
              >
                ⬆️
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  row.pin("bottom", includeLeafRows, includeParentRows)
                }
              >
                ⬇️
              </Button>
            </div>
          ),
      },
      {
        accessorKey: "firstName",
        header: ({ table }: any) => (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={table.getToggleAllRowsExpandedHandler()}
            >
              {table.getIsAllRowsExpanded() ? "👇" : "👉"}
            </Button>
            <span>First Name</span>
          </div>
        ),
        cell: ({ row, getValue }: any) => (
          <div
            className="flex items-center"
            style={{ paddingLeft: `${row.depth * 1.5}rem` }}
          >
            {row.getCanExpand() ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={row.getToggleExpandedHandler()}
              >
                {row.getIsExpanded() ? "👇" : "👉"}
              </Button>
            ) : (
              <span>🔵</span>
            )}
            <span className="ml-2">{getValue()}</span>
          </div>
        ),
      },
      {
        accessorFn: (row: any) => row.lastName,
        id: "lastName",
        header: () => "Last Name",
        cell: (info: any) => info.getValue(),
      },
      { accessorKey: "age", header: "Age" },
      { accessorKey: "visits", header: "Visits" },
      { accessorKey: "status", header: "Status" },
      { accessorKey: "progress", header: "Profile Progress" },
    ],
    [includeLeafRows, includeParentRows]
  );

  const table = useReactTable({
    data,
    columns,
    initialState: { pagination: { pageSize: 20, pageIndex: 0 } },
    state: { expanded, rowPinning },
    onExpandedChange: setExpanded,
    onRowPinningChange: setRowPinning,
    getSubRows: (row) => row.subRows,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    keepPinnedRows,
  });

  const pageCount = table.getPageCount();
  const currentPageIndex = table.getState().pagination.pageIndex; // zero-based
  const currentPage = currentPageIndex + 1;

  const handlePageChange = (page: number) => {
    // page passed in is 1-based
    table.setPageIndex(page - 1);
  };

  return (
    <Card className="p-4">
      <CardHeader>
        <h2 className="text-xl font-semibold">TanStack Table (Shadcn UI)</h2>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
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
              {table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination via shadcn Pagination component */}
        <Pagination className="flex justify-center">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (currentPage > 1) handlePageChange(currentPage - 1);
                }}
                aria-disabled={currentPage <= 1}
              />
            </PaginationItem>

            {Array.from({ length: pageCount }, (_, i) => i + 1).map((page) => {
              // Optionally, you could implement ellipsis logic for large pageCount
              return (
                <PaginationItem key={page}>
                  <PaginationLink
                    href="#"
                    isActive={page === currentPage}
                    onClick={(e) => {
                      e.preventDefault();
                      handlePageChange(page);
                    }}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              );
            })}

            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (currentPage < pageCount)
                    handlePageChange(currentPage + 1);
                }}
                aria-disabled={currentPage >= pageCount}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>

        <Separator />

        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-1">
            <Label htmlFor="goto">Go to page:</Label>
            <Input
              id="goto"
              type="number"
              min={1}
              max={pageCount}
              defaultValue={currentPage}
              onChange={(e) => {
                const val = e.target.value ? Number(e.target.value) : 1;
                if (val >= 1 && val <= pageCount) {
                  handlePageChange(val);
                }
              }}
              className="w-20"
            />
          </div>

          <Select
            value={String(table.getState().pagination.pageSize)}
            onValueChange={(val) => table.setPageSize(Number(val))}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Rows per page" />
            </SelectTrigger>
            <SelectContent>
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={String(pageSize)}>
                  Show {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Separator />

        <div className="flex flex-col gap-2">
          {[
            {
              label: "Keep pinned rows across pagination/filtering",
              checked: keepPinnedRows,
              setChecked: setKeepPinnedRows,
            },
            {
              label: "Include leaf rows when pinning parent",
              checked: includeLeafRows,
              setChecked: setIncludeLeafRows,
            },
            {
              label: "Include parent rows when pinning child",
              checked: includeParentRows,
              setChecked: setIncludeParentRows,
            },
            {
              label: "Duplicate pinned rows in main table",
              checked: copyPinnedRows,
              setChecked: setCopyPinnedRows,
            },
          ].map((opt) => (
            <div key={opt.label} className="flex items-center space-x-2">
              <Checkbox
                id={opt.label}
                checked={opt.checked}
                onCheckedChange={() => opt.setChecked(!opt.checked)}
              />
              <Label htmlFor={opt.label}>{opt.label}</Label>
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <Button onClick={() => rerender()}>Force Rerender</Button>
          <Button
            variant="destructive"
            onClick={() => console.log("Clear data")}
          >
            Clear Data
          </Button>
        </div>

        <pre className="text-xs bg-muted p-2 rounded">
          {JSON.stringify(rowPinning, null, 2)}
        </pre>
      </CardContent>
    </Card>
  );
}
