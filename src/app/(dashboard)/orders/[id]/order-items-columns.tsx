"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";

export type OrderItem = {
    id: number;
    quantity: number;
    unit_price: string;
    line_total: string;
    variant: {
        product: {
            name: string;
        };
        color?: { name: string };
        size?: { name: string };
    };
};

export const orderItemsColumns: ColumnDef<OrderItem>[] = [
    {
        header: "Product",
        cell: ({ row }) => (
            <div className="flex flex-col">
                <span className="font-medium">
                    {row.original.variant.product.name}
                </span>
                <span className="text-xs opacity-60">
                    {row.original.variant.color?.name} /{" "}
                    {row.original.variant.size?.name}
                </span>
            </div>
        ),
    },
    {
        header: "Qty",
        accessorKey: "quantity",
    },
    {
        header: "Unit Price",
        cell: ({ row }) => `$${row.original.unit_price}`,
    },
    {
        header: "Total",
        cell: ({ row }) => (
            <Badge variant="secondary">
                ${row.original.line_total}
            </Badge>
        ),
    },
];
