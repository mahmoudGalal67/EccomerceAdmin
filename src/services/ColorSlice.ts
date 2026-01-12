// services/apiSlice.js

import { colorType } from "../types/types";
import { baseApi } from "./baseApi";

// Step 1: Create API slice
export const ColorSlice = baseApi.injectEndpoints({
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
