import Link from "next/link";
import StatusCell from "@/components/StatusCell";
import { Checkbox } from "@/components/ui/checkbox";

export type Order = {
  id: number;
  subtotal: number;
  order_id: number;
  status: "processing" | "completed" | "cancelled";
  order: {
    name: string;
    email: string;
    phone: string;
    city: string;
    payment_status: "paid" | "pending" | "failed";
  };
  items: { id: number; variant: { product: { name: string } } }[];
};


export const columns = [
  {
    id: "select",
    header: ({ table }: any) => (
      <Checkbox
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
      />
    ),
    cell: ({ row }: any) => (
      <Checkbox
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        checked={row.getIsSelected()}
      />
    ),
  },
  {
    accessorKey: "order_id",
    header: "#Order ID",
    cell: ({ row }: any) => (
      <Link href={`/orders/${row.original.order_id}`} className="font-medium text-blue-600 hover:underline">
        #{row.original.id}
      </Link>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: StatusCell,
    enableSorting: false,
    filterFn: (row: any, columnId: any, filterValue: any) => {
      if (!filterValue) return true;
      return row.getValue(columnId) === filterValue;
    },
  },
  {
    id: "order_name",
    header: "Name",
    accessorFn: (row: any) => row.order?.name ?? "",
    cell: (info: any) => info.getValue(),
  },
  {
    id: "order_email",
    header: "Email",
    accessorFn: (row: any) => row.order?.email ?? "",
    cell: (info: any) => info.getValue(),
    enableSorting: false,
  },
  {
    id: "order_phone",
    header: "Phone",
    accessorFn: (row: any) => row.order?.phone ?? "",
    cell: (info: any) => info.getValue(),
    enableSorting: false,
  },
  {
    id: "order_city",
    header: "City",
    accessorFn: (row: any) => row.order?.city ?? "",
    cell: (info: any) => info.getValue(),
    enableSorting: false,
  },
  {
    accessorFn: (row: any) => row.items.map((i: any) => i.variant.product.name).join(", "),
    header: "Products",
    enableSorting: false,
  },
  {
    accessorKey: "subtotal",
    header: "Subtotal",
    cell: ({ row }: any) => <span>${row.original.subtotal}</span>,
  },
]

