// services/colorApi.ts
import { baseApi } from "./baseApi";

export const ChatsAdminSlice = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // 🔹 GET Chats
        getChats: builder.query<any, void>({
            query: () => "/admin/support/chats",
            providesTags: ["Chats"],
        }),

        // 🔹 GET Chat (BY ID)
        getChat: builder.query<any, any>({
            query: ({ id }) => ({
                url: `/admin/support/messages/${id}`,
            }),
        }),
        // 🔹 ADD Chat (OPTIMISTIC)
        sendAdminMessage: builder.mutation<any, any>({
            query: (data) => ({
                url: "/admin/support/send",
                method: "POST",
                body: data,
            }),
        }),

        // 🔹 DELETE Chat (OPTIMISTIC)
        deleteChat: builder.mutation<{ success: boolean }, number>({
            query: (id) => ({
                url: `/colors/${id}`,
                method: "DELETE",
            }),
        }),
    }),
});

export const {
    useGetChatsQuery,
    useSendAdminMessageMutation,
    useGetChatQuery,
    useDeleteChatMutation,
} = ChatsAdminSlice;
