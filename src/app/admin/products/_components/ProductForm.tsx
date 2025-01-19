"use client";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { formatCurrency } from "@/lib/formatters";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addSchema, TaddSchema, editSchema, TeditSchema } from "@/lib/types";
import { addProduct, editProduct } from "../../_actions/products";
import { toast } from "sonner";
import { Product } from "@prisma/client";
import Image from "next/image";

export default function ProductForm({ product }: { product?: Product | null }) {
  const router = useRouter();
  const schema = product ? editSchema : addSchema;
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
    setValue,
  } = useForm<TaddSchema>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: product?.name,
      description: product?.description,
      priceInCents: product?.priceInCents,
      file: undefined,
      image: undefined,
    },
  });

  const watchPriceInCents = watch("priceInCents", 0);

  const onSubmit = async (data: TaddSchema) => {
    try {
      const result = product
        ? await editProduct(product.id, data as TeditSchema)
        : await addProduct(data);

      if (result.success) {
        toast(
          product ? "Product has been updated." : "Product has been created."
        );
        reset();
        router.push("/admin/products");
      }
    } catch (error) {
      console.error("Error submitting product:", error);
      toast.error(
        product ? "Failed to update product." : "Failed to create product."
      );
    }
  };

  const handleFileChange =
    (fieldName: "file" | "image") =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        setValue(fieldName, file); // Manually set the file value in react-hook-form
      }
    };

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          {...register("name")}
          type="text"
          id="name"
          aria-invalid={!!errors.name}
        />
        {errors.name && <p className="text-red-500">{errors.name.message}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="priceInCents">Price In Cents</Label>
        <Input
          {...register("priceInCents", { valueAsNumber: true })}
          type="number"
          id="priceInCents"
          aria-invalid={!!errors.priceInCents}
        />
        {errors.priceInCents && (
          <p className="text-red-500">{errors.priceInCents.message}</p>
        )}
        <div className="text-muted-foreground">
          {formatCurrency(watchPriceInCents / 100)}
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          {...register("description")}
          id="description"
          aria-invalid={!!errors.description}
        />
        {errors.description && (
          <p className="text-red-500">{errors.description.message}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="file">File</Label>
        <Input
          type="file"
          id="file"
          aria-invalid={!!errors.file}
          required={product == null}
          onChange={handleFileChange("file")} // Handle file input manually
        />
        {product !== null && (
          <div className="text-muted-foreground">{product?.filePath}</div>
        )}
        {errors.file && <p className="text-red-500">{errors.file.message}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="image">Image</Label>
        <Input
          type="file"
          id="image"
          aria-invalid={!!errors.image}
          required={product == null}
          onChange={handleFileChange("image")} // Handle image input manually
        />
        {product !== null && (
          <div className="text-muted-foreground">{product?.imagePath}</div>
        )}
        {product && (
          <Image
            src={product?.imagePath}
            height={400}
            width={600}
            alt="product image"
            className="ring-1 rounded-lg"
          />
        )}
        {errors.image && <p className="text-red-500">{errors.image.message}</p>}
      </div>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Saving ..." : "Save"}
      </Button>
    </form>
  );
}
