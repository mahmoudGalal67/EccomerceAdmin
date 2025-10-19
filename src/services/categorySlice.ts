// services/apiSlice.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { categoryType } from "../types/types";

// Step 1: Create API slice
export const categorySlice = createApi({
  reducerPath: "category", // unique key in store
  baseQuery: fetchBaseQuery({
    baseUrl: "http://127.0.0.1:8000/api",
    prepareHeaders: (headers) => {
      // const token = localStorage.getItem("access_token");
      const token =
        "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOjIsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwiaWF0IjoxNzYwNzQ0NDA3LCJleHAiOjE3NjEwNDQ0MDd9.-s3Iix03YlYgmGHwi_AP-41aB7FmWDCfcgUJ2z0eprg";
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    // Step 2: Define endpoints
    getCategories: builder.query<categoryType[], void>({
      query: () => "/categories",
    }),

    addCategory: builder.mutation({
      query: (newCategory) => ({
        url: "/categories",
        method: "POST",
        body: newCategory,
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
  }),
});

// Step 3: Export hooks for components
export const {
  useGetCategoriesQuery,
  useAddCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categorySlice;
