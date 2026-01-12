'use client';

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

export function DataTable({
  columns,
  data,
  page,
  setPage,
  pageCount,
  selectedIds,
  setSelectedIds,
  search,
  isLoading,
}) {
  const qc = useQueryClient();

  const updateStatus = useMutation({
    mutationFn: ({ id, status }) =>
      api.patch(`/orders/${id}/status`, { status }),
    onError: (_, __, ctx: any) => ctx?.rollback?.(),
    onSettled: () => qc.invalidateQueries({ queryKey: ["orders"] }),
  });

  const table = useReactTable({
    data,
    columns,
    manualPagination: true,
    pageCount,
    getCoreRowModel: getCoreRowModel(),
    state: {
      rowSelection: Object.fromEntries(selectedIds.map(id => [id, true])),
    },
    onRowSelectionChange: (updater) => {
      const next =
        typeof updater === "function"
          ? updater(table.getState().rowSelection)
          : updater;
      setSelectedIds(Object.keys(next).map(Number));
    },
    meta: {
      search,
      updateStatus: (id, status, rollback) =>
        updateStatus.mutate({ id, status }, { context: { rollback } }),
    },
  });

  if (isLoading) return <p>Loading…</p>;

  return (
    <div>
      <table border={1} width="100%">
        <thead>
          {table.getHeaderGroups().map(hg => (
            <tr key={hg.id}>
              {hg.headers.map(h => (
                <th key={h.id}>
                  {flexRender(h.column.columnDef.header, h.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map(row => (
            <tr key={row.id}>
              {row.getVisibleCells().map(cell => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ marginTop: 10 }}>
        <button disabled={page === 1} onClick={() => setPage(p => p - 1)}>
          Prev
        </button>
        <span> Page {page} </span>
        <button disabled={page === pageCount} onClick={() => setPage(p => p + 1)}>
          Next
        </button>
      </div>
    </div>
  );
}
