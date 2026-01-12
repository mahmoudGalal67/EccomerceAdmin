// src/services/orderApi.ts
import { baseApi } from "./baseApi";

export const orderApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // 🔹 SELLER ORDERS WITH SEARCH & FILTERS
        getOrders: builder.query<any, { search?: string }>({
            query: ({ search }) => ({
                url: "/orders/seller",
                params: { search },
            }),
            providesTags: ["Orders"],
        }),

        getOrderById: builder.query<any, number>({
            query: (id) => `/orders/${id}`,
        }),

        updateOrderStatus: builder.mutation({
            query: ({ id, status }) => ({
                url: `/orders/update-status/${id}`,
                method: "POST",
                body: { status },
            }),
        }),

        // 🔴 DELETE MULTI ROWS
        deleteOrders: builder.mutation<
            { message: string },
            { ids: number[] }
        >({
            query: (body) => ({
                url: "/orders/cancel-seller",
                method: "POST",
                body,
            }),
            async onQueryStarted({ ids }, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(
                    orderApi.util.updateQueryData(
                        "getOrders",
                        { search: undefined },
                        (draft: any) => {
                            draft.data = draft.data.filter(
                                (order: any) => !ids.includes(order.id)
                            );
                        }
                    )
                );

                try {
                    await queryFulfilled;
                } catch {
                    patchResult.undo();
                }
            },
        }),
    }),
});

export const {
    useGetOrdersQuery,
    useGetOrderByIdQuery,
    useUpdateOrderStatusMutation,
    useDeleteOrdersMutation,
} = orderApi;
