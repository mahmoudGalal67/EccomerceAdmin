"use client";
import React from "react";
import { useProductForm } from "../../../hooks/useProductForm";
import { createProductFormData } from "@/actions/productActions";
import VariantFields from "../../../components/VariantFields";
import { useGetCategoriesQuery } from "@/services/categorySlice";
import { useAddProductMutation } from "@/services/ProductSlice";

export default function ProductForm() {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    errors,
    fields,
    append,
    remove,
    reset,
  } = useProductForm();

  const [addProduct, { isLoading }] = useAddProductMutation();
  const { data: categories } = useGetCategoriesQuery();

  const onSubmit = async (data: any) => {
    const convertedData = createProductFormData(data);
    try {
      const result = await addProduct(convertedData).unwrap();
      console.log("✅ Product created:", result);
      reset();
    } catch (error: any) {
      console.error("❌ Error:", error.response?.data || error);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-3xl mx-auto space-y-8"
      >
        {/* Product Info */}
        <div>
          <label className="block text-sm mb-2">Product Name</label>
          <input
            {...register("name")}
            className="w-full rounded-lg p-2 bg-[#171717] border border-gray-700"
          />
          {errors.name && (
            <p className="text-red-500 text-sm">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm mb-2">Description</label>
          <textarea
            {...register("description")}
            className="w-full rounded-lg p-2 bg-[#171717] border border-gray-700"
          />
          {errors.description && (
            <p className="text-red-500 text-sm">{errors.description.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm mb-2">Base Price</label>
          <input
            type="number"
            {...register("base_price")}
            className="w-full rounded-lg p-2 bg-[#171717] border border-gray-700"
          />
          {errors.base_price && (
            <p className="text-red-500 text-sm">{errors.base_price.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm mb-2">Category</label>
          <select
            {...register("category_id")}
            className="w-full rounded-lg p-2 bg-[#171717] border border-gray-700"
          >
            <option value="">Select category</option>
            {categories?.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          {errors.category_id && (
            <p className="text-red-500 text-sm">{errors.category_id.message}</p>
          )}
        </div>

        {/* Variants */}
        <div>
          <h2 className="text-lg font-bold mb-4">Variants</h2>
          {fields.map((field, index) => (
            <VariantFields
              key={field.id}
              index={index}
              field={field}
              register={register}
              watch={watch}
              setValue={setValue}
              remove={remove}
              errors={errors}
              totalFields={fields.length}
            />
          ))}

          <button
            type="button"
            className="bg-white text-black px-3 py-2 rounded-lg text-sm"
            onClick={() =>
              append({
                id: crypto.randomUUID(),
                price: "",
                stock: "",
                color_id: "",
                size_id: "",
                images: [],
              })
            }
          >
            ➕ Add Variant
          </button>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="bg-[#171717] hover:bg-blue-600 px-4 py-2 rounded-lg text-white"
        >
          {isLoading ? "Loading ..." : "Submit Product"}
        </button>
      </form>
    </div>
  );
}
