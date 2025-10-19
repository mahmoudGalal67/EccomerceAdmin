// services/apiSlice.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { colorType } from "../types/types";

// Step 1: Create API slice
export const ColorSlice = createApi({
  reducerPath: "Color", // unique key in store
  baseQuery: fetchBaseQuery({
    baseUrl: "http://127.0.0.1:8000/api",
  }),
  endpoints: (builder) => ({
    // Step 2: Define endpoints
    getColors: builder.query<colorType[], void>({
      query: () => "/colors",
    }),

    addColor: builder.mutation({
      query: (newColor) => ({
        url: "/colors",
        method: "POST",
        body: newColor,
      }),
    }),
    updateColor: builder.mutation({
      query: ({ id, ...rest }) => ({
        url: `/colors/${id}`,
        method: "PUT",
        body: rest,
      }),
    }),
    deleteColor: builder.mutation({
      query: (id) => ({
        url: `/colors/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

// Step 3: Export hooks for components
export const {
  useGetColorsQuery,
  useAddColorMutation,
  useUpdateColorMutation,
  useDeleteColorMutation,
} = ColorSlice;
