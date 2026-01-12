// services/apiSlice.js
import { ProductType } from "../types/types";
import { baseApi } from "./baseApi";

// Step 1: Create API slice
export const ProductSlice = baseApi.injectEndpoints({
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
