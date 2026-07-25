"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";

export type OrderItem = {
    id: number;
    quantity: number;
    unit_price: string;
    line_total: string;

    product?: {
        translations: { name: string }[];
    };

    variant?: {
        product: {
            name: string;
        };
        color?: { name: string };
        size?: { name: string };
    } | null;
};

export const orderItemsColumns: ColumnDef<OrderItem>[] = [
    {
        header: "Product",
        cell: ({ row }) => {
            const item = row.original;

            const productName =
                item.variant?.product?.name ??
                item.product?.translations?.[0]?.name ??
                "Unknown Product";

            const color = item.variant?.color?.name;
            const size = item.variant?.size?.name;

            return (
                <div className="flex flex-col">
                    <span className="font-medium">{productName}</span>

                    {(color || size) && (
                        <span className="text-xs opacity-60">
                            {[color, size].filter(Boolean).join(" / ")}
                        </span>
                    )}
                </div>
            );
        },
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
