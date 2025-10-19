"use client";

import {
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Upload } from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import { ScrollArea } from "./ui/scroll-area";
import { useAddCategoryMutation } from "@/services/categorySlice";
import { createCategoryFormData } from "@/actions/productActions";

// ✅ Define schema with optional file
const formSchema = z.object({
  name: z.string().nonempty({ message: "Name is required!" }),
  slug: z.string().nonempty({ message: "Slug is required!" }),
  description: z.string().optional(),
  icon: z
    .instanceof(File)
    .refine((file) => file.size <= 5 * 1024 * 1024, "Max file size is 5MB")
    .refine(
      (file) => ["image/jpeg", "image/png", "image/webp"].includes(file.type),
      "Only .jpg, .png, .webp formats are supported."
    )
    .optional()
    .or(z.literal("")),
});

type FormValues = z.infer<typeof formSchema>;

const AddCategory = () => {
  const [preview, setPreview] = useState<string | null>(null);
  const [addCategory, { isLoading }] = useAddCategoryMutation();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", slug: "", description: "", icon: undefined },
  });

  const onSubmit = async (values: FormValues) => {
    const convertedData = createCategoryFormData(values);
    try {
      const result = await addCategory(convertedData).unwrap();

      console.log("✅ Category created:", result);
      form.reset();
      setPreview(null);
    } catch (error: any) {
      console.error(error);
    }
  };

  return (
    <SheetContent>
      <ScrollArea className="h-screen">
        <SheetHeader>
          <SheetTitle className="mb-4">Add Category</SheetTitle>
          <SheetDescription asChild>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
                encType="multipart/form-data"
              >
                {/* Name */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Category name" />
                      </FormControl>
                      <FormDescription>Enter category name.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Slug */}
                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Slug</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="category-slug" />
                      </FormControl>
                      <FormDescription>Enter category slug.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Description */}
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Describe the category..."
                        />
                      </FormControl>
                      <FormDescription>
                        A short description of the category.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* File Upload */}
                <FormField
                  control={form.control}
                  name="icon"
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel>Category Icon</FormLabel>
                        <FormControl>
                          <div className="space-y-3">
                            {/* Hidden file input */}
                            <Input
                              type="file"
                              accept="image/*"
                              id="icon-upload"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  field.onChange(file);
                                  // generate preview URL
                                  const url = URL.createObjectURL(file);
                                  setPreview(url);
                                }
                              }}
                            />

                            {/* Custom label acting as button */}
                            <label
                              htmlFor="icon-upload"
                              className="flex items-center justify-center gap-2 p-2 border rounded-md cursor-pointer hover:bg-accent w-fit"
                            >
                              <Upload className="w-4 h-4" />
                              <span>Choose Icon</span>
                            </label>

                            {/* Preview image */}
                            {preview && (
                              <div className="mt-2">
                                <Image
                                  src={preview}
                                  alt="Preview"
                                  width={60}
                                  height={60}
                                  className="rounded-md object-cover border"
                                />
                              </div>
                            )}
                          </div>
                        </FormControl>
                        <FormDescription>
                          Upload category icon (JPG, PNG, WEBP up to 5MB)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />

                <Button type="submit">
                  {isLoading ? "Loading" : "Submit"}
                </Button>
              </form>
            </Form>
          </SheetDescription>
        </SheetHeader>
      </ScrollArea>
    </SheetContent>
  );
};

export default AddCategory;
