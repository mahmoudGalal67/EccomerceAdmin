import React from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  arrayMove,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  restrictToHorizontalAxis,
  restrictToParentElement,
} from "@dnd-kit/modifiers";

import { useGetColorsQuery } from "@/services/ColorSlice";
import { useGetSizesQuery } from "@/services/SizeSlice";

// Small component for each draggable image
function SortableImage({ file, onRemove }: any) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: file.previewId });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    touchAction: "none",
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <div className="relative w-20 h-20">
        <img
          src={file.previewUrl ?? URL.createObjectURL(file)}
          alt="preview"
          className="w-20 h-20 object-cover rounded cursor-move"
          {...listeners}
        />
        <button
          type="button"
          className="absolute top-0 right-0 bg-red-500 text-white text-[8px] cursor-pointer p-1 rounded-full"
          onClick={(e) => {
            e.stopPropagation(); // prevent drag capture
            onRemove(file);
          }}
        >
          ✖
        </button>
      </div>
    </div>
  );
}

export default function VariantFields({
  index,
  field,
  register,
  watch,
  setValue,
  remove,
  errors,
}: any) {
  const selectedColor = watch(`variants.${index}.color_id`);
  const selectedSize = watch(`variants.${index}.size_id`);
  const images = watch(`variants.${index}.images`) || [];

  const { data: colors } = useGetColorsQuery();
  const { data: sizes } = useGetSizesQuery();

  // DnD sensors setup
  const sensors = useSensors(useSensor(PointerSensor));

  // Handle reordering
  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = images.findIndex(
      (img: any) => img.previewId === active.id
    );
    const newIndex = images.findIndex((img: any) => img.previewId === over.id);

    const reordered = arrayMove(images, oldIndex, newIndex);
    setValue(`variants.${index}.images`, reordered, { shouldValidate: true });
  };

  return (
    <div
      key={field.id}
      className="p-4 mb-6 rounded-xl bg-[#171717] border border-gray-700 space-y-4"
    >
      {/* Price + Stock */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm mb-2">Price</label>
          <input
            type="number"
            {...register(`variants.${index}.price`)}
            className="w-full rounded-lg p-2 bg-[#171717] border border-gray-600"
          />
          {errors.variants?.[index]?.price && (
            <p className="text-red-500 text-sm">
              {errors.variants[index]?.price?.message}
            </p>
          )}
        </div>
        <div>
          <label className="block text-sm mb-2">Stock</label>
          <input
            type="number"
            {...register(`variants.${index}.stock`)}
            className="w-full rounded-lg p-2 bg-[#171717] border border-gray-600"
          />
          {errors.variants?.[index]?.stock && (
            <p className="text-red-500 text-sm">
              {errors.variants[index]?.stock?.message}
            </p>
          )}
        </div>
      </div>

      {/* Colors */}
      <div>
        <label className="block text-sm mb-2">Color</label>
        <div className="flex gap-4 flex-wrap">
          {colors?.map((color) => {
            const isSelected = selectedColor == color.id;
            return (
              <label
                key={color.id}
                className={`flex items-center gap-2 cursor-pointer border-2 rounded-full p-1 ${
                  isSelected ? "border-white" : "border-transparent"
                }`}
              >
                <input
                  type="radio"
                  value={color.id}
                  {...register(`variants.${index}.color_id`)}
                  className="hidden"
                />
                <div
                  className="w-6 h-6 rounded-full"
                  style={{ backgroundColor: color.hex }}
                />
              </label>
            );
          })}
        </div>
        {errors.variants?.[index]?.color_id && (
          <p className="text-red-500 text-sm">
            {errors.variants[index]?.color_id?.message}
          </p>
        )}
      </div>

      {/* Sizes */}
      <div>
        <label className="block text-sm mb-2">Size</label>
        <div className="flex gap-4 flex-wrap">
          {sizes?.map((size) => {
            const isSelected = selectedSize == size.id;
            return (
              <label
                key={size.id}
                className={`w-10 h-10 flex items-center justify-center rounded-md border-2 cursor-pointer ${
                  isSelected ? "border-white" : "border-gray-600"
                }`}
              >
                <input
                  type="radio"
                  value={size.id}
                  {...register(`variants.${index}.size_id`)}
                  className="hidden"
                />
                <span className="text-xs">{size.code}</span>
              </label>
            );
          })}
        </div>
        {errors.variants?.[index]?.size_id && (
          <p className="text-red-500 text-sm">
            {errors.variants[index]?.size_id?.message}
          </p>
        )}
      </div>

      {/* Image upload + DnD reorder */}
      {selectedColor && selectedSize && (
        <div>
          <label className="block text-sm mb-2">Upload Images</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => {
              const files = Array.from(e.target.files || []).map((file) =>
                Object.assign(file, {
                  previewId: crypto.randomUUID(),
                  previewUrl: URL.createObjectURL(file),
                })
              );
              setValue(`variants.${index}.images`, [...images, ...files], {
                shouldValidate: true,
              });
            }}
            className="text-xs"
          />

          {/* Drag & Drop Preview */}
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
            modifiers={[restrictToHorizontalAxis, restrictToParentElement]} // ✅ Limit drag direction
          >
            <SortableContext
              items={images.map((file: any) => file.previewId)}
              strategy={rectSortingStrategy}
            >
              <div className="flex flex-wrap gap-3 mt-2">
                {images?.map((file: any, i: number) => (
                  <SortableImage
                    key={file.previewId ?? file.name}
                    file={file}
                    index={i}
                    onRemove={(fileToRemove: any) => {
                      if (fileToRemove.previewUrl)
                        URL.revokeObjectURL(fileToRemove.previewUrl);
                      const updated = images.filter(
                        (f: any) => f !== fileToRemove
                      );
                      setValue(`variants.${index}.images`, updated, {
                        shouldValidate: true,
                      });
                    }}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>

          {errors.variants?.[index]?.images && (
            <p className="text-red-500 text-sm">
              {errors.variants[index]?.images?.message as string}
            </p>
          )}
        </div>
      )}

      {/* Delete Variant */}
      <button
        type="button"
        className="text-red-400 text-sm mt-2 bg-[#030000] p-2 rounded-2xl"
        onClick={() => remove(index)}
      >
        ❌ Delete Variant
      </button>
    </div>
  );
}
