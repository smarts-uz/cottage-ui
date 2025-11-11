/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import * as React from "react";
import {
  useQuery,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
  RowSelectionState,
} from "@tanstack/react-table";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { Card, CardHeader, CardContent } from "../components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../components/ui/pagination";
import { Skeleton } from "../components/ui/skeleton";
import { toast, Toaster } from "sonner";

// ---- TanStack Query client ----
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60,
      retry: 3,
      refetchInterval: 1000 * 60,
    },
  },
});

// ---- Fetch users ----
const fetchUsers = async () => {
  const res = await fetch("https://jsonplaceholder.typicode.com/users");
  if (!res.ok) throw new Error("Network error");
  return res.json();
};

// ---- Table component ----
function UsersTableInner({ triggerEvent = () => null }: { triggerEvent: any }) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });

  const columns = React.useMemo(
    () => [
      { accessorKey: "id", header: "ID" },
      { accessorKey: "name", header: "Name" },
      { accessorKey: "username", header: "Username" },
      { accessorKey: "email", header: "Email" },
      {
        accessorFn: (row: any) =>
          `${row.address.street}, ${row.address.suite}, ${row.address.city}`,
        id: "address",
        header: "Address",
      },
      { accessorKey: "phone", header: "Phone" },
      { accessorKey: "website", header: "Website" },
      {
        accessorFn: (row: any) => row.company.name,
        id: "company",
        header: "Company",
      },
    ],
    []
  );

  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});

  const table = useReactTable({
    data: data ?? [],
    columns,
    state: { rowSelection },
    enableRowSelection: true,
    onRowSelectionChange: (updater) => {
      const newSelection =
        typeof updater === "function" ? updater(rowSelection) : updater;

      // single-selection logic
      const selectedIds = Object.keys(newSelection);
      const latestId = selectedIds[selectedIds.length - 1];
      const singleSelection = latestId ? { [latestId]: true } : {};

      setRowSelection(singleSelection);

      if (latestId) {
        const selectedRow = table.getRow(latestId);
        if (selectedRow) {
          toast(`Selected user ID: ${selectedRow.original.id}`);
          triggerEvent("onClick", { id: selectedRow.original.id });
        }
      }
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 5 } },
  });

  const currentPage = table.getState().pagination.pageIndex + 1;
  const pageCount = table.getPageCount();

  if (isError)
    return (
      <Card className="p-4">
        <CardHeader>
          <h2 className="text-xl font-semibold">Users Table</h2>
        </CardHeader>
        <CardContent>Error loading users.</CardContent>
      </Card>
    );

  return (
    <Card className="p-4">
      <CardHeader>
        <h2 className="text-xl font-semibold">
          Users Table (Full Schema + Selection)
        </h2>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((hg) => (
                <TableRow key={hg.id}>
                  {hg.headers.map((header) => (
                    <TableHead key={header.id}>
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>

            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    {columns.map((col) => (
                      <TableCell key={col.id || col.accessorKey}>
                        <Skeleton className="h-4 w-[150px]" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : table.getRowModel().rows.length > 0 ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() ? "selected" : undefined}
                    onClick={() => row.toggleSelected()}
                    className={`cursor-pointer transition ${
                      row.getIsSelected() ? "bg-muted" : "hover:bg-muted/50"
                    }`}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="text-center">
                    No users found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* --- Pagination --- */}
        <Pagination className="flex justify-center">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  table.previousPage();
                }}
                aria-disabled={!table.getCanPreviousPage()}
              />
            </PaginationItem>

            {Array.from({ length: pageCount }, (_, i) => i + 1).map((page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  href="#"
                  isActive={page === currentPage}
                  onClick={(e) => {
                    e.preventDefault();
                    table.setPageIndex(page - 1);
                  }}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  table.nextPage();
                }}
                aria-disabled={!table.getCanNextPage()}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </CardContent>
    </Card>
  );
}

// ---- QueryClientProvider wrapper ----
export function TableQuery({
  triggerEvent = () => null,
}: {
  triggerEvent: any;
}) {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster />
      <ReactQueryDevtools initialIsOpen={false} />
      <UsersTableInner triggerEvent={triggerEvent} />
    </QueryClientProvider>
  );
}
