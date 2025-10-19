import axios from "axios";
import { ProductForm } from "@/schemas/productSchema";
import { categoryType } from "@/types/types";

export const createProductFormData = (data: ProductForm) => {
  const formData = new FormData();

  formData.append("name", data.name);
  formData.append("description", data.description);
  formData.append("base_price", data.base_price || "0");
  formData.append("category_id", data.category_id);

  data.variants?.forEach((variant, i) => {
    formData.append(`variants[${i}][price]`, variant.price);
    formData.append(`variants[${i}][stock]`, variant.stock);
    formData.append(`variants[${i}][color_id]`, variant.color_id);
    formData.append(`variants[${i}][size_id]`, variant.size_id);

    variant.images?.forEach((file, j) => {
      formData.append(`variants[${i}][images][${j}]`, file);
    });
  });
  return formData;
};
export const createCategoryFormData = (data: categoryType) => {
  const formData = new FormData();
  formData.append("name", data.name);
  formData.append("description", data.description || "");
  formData.append("slug", data.slug || "0");
  formData.append("icon", data.icon || "0");

  return formData;
};
