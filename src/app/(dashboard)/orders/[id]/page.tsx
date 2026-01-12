"use client";

import { useParams } from "next/navigation";
import { useGetOrderByIdQuery } from "@/services/orderApi";
import { orderItemsColumns } from "./order-items-columns";
import { OrderItemsTable } from "./order-items-table";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Loading from "../loading";

export default function OrderDetailsPage() {

    // Status & Payment Colors
    const statusColors: Record<string, string> = {
        processing: "bg-blue-500/20 text-blue-700",
        completed: "bg-green-500/20 text-green-700",
        cancelled: "bg-red-500/20 text-red-700",
    };
    const paymentColors: Record<string, string> = {
        paid: "bg-green-500/20 text-green-700",
        unpaid: "bg-yellow-500/20 text-yellow-700",
    };

    const { id } = useParams();
    const { data, isLoading, isError } = useGetOrderByIdQuery(Number(id));

    if (isLoading) return <Loading />
    if (isError) return <p>Error loading order</p>;

    return (
        <div className="space-y-6">
            {/* ORDER INFO */}
            <Card>
                <CardHeader>
                    <h2 className="font-semibold text-lg">
                        Order #{data.id}
                    </h2>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <p className="my-2"><strong>Name:</strong> {data.name}</p>
                        <p className="my-2"><strong>Email:</strong> {data.email}</p>
                        <p className="my-2"><strong>Phone:</strong> {data.phone}</p>
                        <p className="my-2"><strong>City:</strong> {data.city}</p>
                    </div>
                    <div>
                        <p className="my-2"><strong>Subtotal:</strong> ${data.subtotal}</p>
                        <p className={`my-2 mr-2`}><strong>Status:</strong> <Badge className={statusColors[data.status]}>{data.status}</Badge></p>
                        <p className={`my-2 mr-2`}><strong>Payment:</strong> <Badge className={paymentColors[data.payment_status]}>{data.payment_status}</Badge></p>
                    </div>
                </CardContent>
            </Card>

            {/* SELLER ORDERS */}
            {data.seller_orders.map((sellerOrder: any) => (
                <Card key={sellerOrder.id}>
                    <CardHeader className="flex flex-row justify-between">
                        <h3 className="font-semibold">
                            Seller: {sellerOrder.seller.shop_name}
                        </h3>
                        <Badge className={statusColors[sellerOrder.status]}>{sellerOrder.status}</Badge>
                    </CardHeader>

                    <CardContent>
                        <OrderItemsTable
                            data={sellerOrder.items}
                            columns={orderItemsColumns}
                        />
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
