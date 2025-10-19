import { z } from "zod";

// ✅ Variant schema
export const variantSchema = z.object({
  id: z.string(),
  price: z.string().min(1, "Price is required"),
  stock: z.string().min(1, "Stock is required"),
  color_id: z.string().min(1, "Color is required"),
  size_id: z.string().min(1, "Size is required"),
  sku: z.string().optional(),
  images: z
    .array(z.instanceof(File), {
      required_error: "At least one image is required",
    })
    .min(1, "At least one image is required"),
});

// ✅ Product schema
export const productSchema = z
  .object({
    name: z.string().min(2, "Product name required"),
    description: z
      .string()
      .min(5, "Description required with at least 5 characters"),
    base_price: z.string().optional(),
    category_id: z.string().min(1, "Category required"),
    variants: z.array(variantSchema).optional(),
  })
  .refine(
    (data) => {
      if (!data.variants || data.variants.length === 0) {
        return !!data.base_price;
      }
      return true;
    },
    {
      message: "Base price is required when no variants exist",
      path: ["base_price"],
    }
  );

export type ProductForm = z.infer<typeof productSchema>;
