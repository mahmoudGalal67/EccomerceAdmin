"use client";

import {
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
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
import Image from "next/image";
import { ScrollArea } from "./ui/scroll-area";
import { useAddCategoryForm } from "@/hooks/useAddCategoryForm";

const AddCategory = () => {
  const { form, onSubmit, handleFileChange, preview, isLoading } =
    useAddCategoryForm();

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
                  render={() => (
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
                            onChange={(e) =>
                              handleFileChange(e.target.files?.[0])
                            }
                          />

                          {/* Custom upload label */}
                          <label
                            htmlFor="icon-upload"
                            className="flex items-center justify-center gap-2 p-2 border rounded-md cursor-pointer hover:bg-accent w-fit"
                          >
                            <Upload className="w-4 h-4" />
                            <span>Choose Icon</span>
                          </label>

                          {/* Preview */}
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
                  )}
                />

                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Loading..." : "Submit"}
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
