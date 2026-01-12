'use client';

import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { Order } from "@/types/order";

function highlight(text: string, q?: string) {
  if (!q) return text;
  const r = new RegExp(`(${q})`, "gi");
  return text.split(r).map((p, i) =>
    r.test(p) ? <mark key={i}>{p}</mark> : p
  );
}

export const columns = (): ColumnDef<Order>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <input
        type="checkbox"
        checked={table.getIsAllPageRowsSelected()}
        onChange={table.getToggleAllPageRowsSelectedHandler()}
      />
    ),
    cell: ({ row }) => (
      <input
        type="checkbox"
        checked={row.getIsSelected()}
        onChange={row.getToggleSelectedHandler()}
      />
    ),
  },
  {
    header: "Order",
    cell: ({ row, table }) => (
      <Link href={`/orders/${row.original.order_id}`}>
        {highlight(`#${row.original.id}`, table.options.meta?.search)}
      </Link>
    ),
  },
  {
    header: "Customer",
    cell: ({ row, table }) => (
      <div>
        <div>
          {highlight(row.original.order.name, table.options.meta?.search)}
        </div>
        <small>{row.original.order.email}</small>
      </div>
    ),
  },
  {
    header: "City",
    accessorFn: (row) => row.order.city,
  },
  {
    header: "Products",
    cell: ({ row }) =>
      row.original.items.map(i => i.variant.product.name).join(", "),
  },
  {
    header: "Total",
    accessorKey: "subtotal",
  },
  {
    header: "Status",
    cell: ({ row, table }) => {
      const meta: any = table.options.meta;
      const old = row.original.status;

      return (
        <select
          value={row.original.status}
          onChange={(e) => {
            const value = e.target.value;
            row.original.status = value;
            meta.updateStatus(row.original.id, value, () => {
              row.original.status = old;
            });
          }}
        >
          {["pending", "processing", "shipped", "completed", "cancelled"].map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      );
    },
  },
];
