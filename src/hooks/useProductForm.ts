"use client";

import { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productSchema, ProductForm } from "../schemas/productSchema";

export const useProductForm = () => {
  const {
    register,
    handleSubmit,
    watch,
    control,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ProductForm>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      description: "",
      base_price: "",
      category_id: "",
      variants: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "variants",
  });

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      const allVariants = watch("variants") || [];
      allVariants.forEach((variant) => {
        variant.images?.forEach((file: any) => {
          if (file.previewUrl) {
            URL.revokeObjectURL(file.previewUrl);
          }
        });
      });
    };
  }, [watch]);

  return {
    register,
    handleSubmit,
    watch,
    control,
    setValue,
    errors,
    fields,
    append,
    remove,
    reset,
  };
};
