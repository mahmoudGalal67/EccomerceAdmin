// services/apiSlice.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { ProductType } from "../types/types";

// Step 1: Create API slice
export const ProductSlice = createApi({
  reducerPath: "product", // unique key in store
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
  tagTypes: ["Products"], // for cache invalidation
  endpoints: (builder) => ({
    // Step 2: Define endpoints
    getProducts: builder.query<ProductType[], void>({
      query: () => "/products",
      providesTags: ["Products"],
    }),

    addProduct: builder.mutation({
      query: (newProduct) => ({
        url: "/products",
        method: "POST",
        body: newProduct,
      }),
      invalidatesTags: ["Products"],
    }),
    updateProduct: builder.mutation({
      query: ({ id, ...rest }) => ({
        url: `/products/${id}`,
        method: "PUT",
        body: rest,
      }),
    }),
    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `/products/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

// Step 3: Export hooks for components
export const {
  useGetProductsQuery,
  useAddProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = ProductSlice;
