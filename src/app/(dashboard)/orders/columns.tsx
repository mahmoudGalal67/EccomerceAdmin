import Link from "next/link";
import StatusCell from "@/components/StatusCell";
import { Checkbox } from "@/components/ui/checkbox";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronRight, Store } from "lucide-react";

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
      <Link href={`/orders/${row.original.id}`} className="font-medium text-blue-600 hover:underline">
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
    accessorFn: (row: any) => row.name ?? "",
    cell: (info: any) => info.getValue(),
  },
  {
    id: "order_email",
    header: "Email",
    accessorFn: (row: any) => row.email ?? "",
    cell: (info: any) => info.getValue(),
    enableSorting: false,
  },
  {
    id: "order_phone",
    header: "Phone",
    accessorFn: (row: any) => row.phone ?? "",
    cell: (info: any) => info.getValue(),
    enableSorting: false,
  },
  {
    id: "order_city",
    header: "City",
    accessorFn: (row: any) => row.city ?? "",
    cell: (info: any) => info.getValue(),
    enableSorting: false,
  },
  {
    id: "sellers",
    header: "Sellers & Items",
    enableSorting: false,
    cell: ({ row }: any) => {
      const sellerOrders = row.original.seller_orders || [];

      return (
        <div className="space-y-2 min-w-[280px] ">
          {sellerOrders.map((sellerOrder: any) => (
            <Collapsible
              key={sellerOrder.id}
              className="border rounded-lg"
            >
              <CollapsibleTrigger asChild>
                <button className="flex w-full items-center justify-between p-3 hover:bg-muted/50 transition">
                  <div className="flex items-center gap-2">
                    <Store className="h-4 w-4" />

                    <div>
                      <p className="font-medium text-left">
                        {sellerOrder.seller?.shop_name}
                      </p>

                      <p className="text-xs text-muted-foreground">
                        {sellerOrder.items.length} item(s)
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${sellerOrder.status === "completed"
                        ? "bg-green-100 text-green-700"
                        : sellerOrder.status === "processing"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-red-100 text-red-700"
                        }`}
                    >
                      {sellerOrder.status}
                    </span>

                    <ChevronRight className="h-4 w-4" />
                  </div>
                </button>
              </CollapsibleTrigger>

              <CollapsibleContent>
                <div className="border-t p-3 space-y-2">
                  {sellerOrder.items.map((item: any) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between rounded-md bg-muted/40 px-3 py-2"
                    >
                      <div>
                        <p className="text-sm font-medium">
                          {item.variant ? item.variant?.product?.slug : item.product?.translations?.[0].name}
                        </p>

                        <p className="text-xs text-muted-foreground">
                          Qty: {item.quantity}
                        </p>
                      </div>

                      <div className="text-sm font-semibold">
                        ${item.line_total}
                      </div>
                    </div>
                  ))}

                  <div className="flex justify-between border-t pt-2 font-medium">
                    <span>Seller Total</span>
                    <span>${sellerOrder.subtotal}</span>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          ))}
        </div>
      );
    },
  }
]

