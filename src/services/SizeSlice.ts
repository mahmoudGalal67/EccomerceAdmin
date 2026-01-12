import { sizeType } from "../types/types";
import { baseApi } from "./baseApi";

// Step 1: Create API slice
export const SizeSlice = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Step 2: Define endpoints
    getSizes: builder.query<sizeType[], void>({
      query: () => "/sizes",
    }),

    addSize: builder.mutation({
      query: (newSize) => ({
        url: "/sizes",
        method: "POST",
        body: newSize,
      }),
    }),
    updateSize: builder.mutation({
      query: ({ id, ...rest }) => ({
        url: `/sizes/${id}`,
        method: "PUT",
        body: rest,
      }),
    }),
    deleteSize: builder.mutation({
      query: (id) => ({
        url: `/sizes/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

// Step 3: Export hooks for components
export const {
  useGetSizesQuery,
  useAddSizeMutation,
  useUpdateSizeMutation,
  useDeleteSizeMutation,
} = SizeSlice;
