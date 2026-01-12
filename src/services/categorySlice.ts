// services/apiSlice.js
import { categoryType } from "../types/types";
import { baseApi } from "./baseApi";

// Step 1: Create API slice
export const categorySlice = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Step 2: Define endpoints
    getCategories: builder.query<categoryType[], void>({
      query: () => "/categories",
    }),

    addCategory: builder.mutation({
      query: (newCategory) => ({
        url: "/categories",
        method: "POST",
      }),
    }),
    updateCategory: builder.mutation({
      query: ({ id, ...rest }) => ({
        url: `/categories/${id}`,
        method: "PUT",
        body: rest,
      }),
    }),
    deleteCategory: builder.mutation({
      query: (id) => ({
        url: `/categories/${id}`,
        method: "DELETE",
      }),
    }),
    me: builder.query({
      query: () => "/user",
    }),
  }),
});

// Step 3: Export hooks for components
export const {
  useGetCategoriesQuery,
  useAddCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useMeQuery,
} = categorySlice;
