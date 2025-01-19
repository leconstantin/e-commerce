"use client";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { formatCurrency } from "@/lib/formatters";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addSchema, TaddSchema } from "@/lib/types";
import { addProduct } from "../../_actions/products";
import { toast } from "sonner";

export default function ProductForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
    setValue,
  } = useForm<TaddSchema>({
    resolver: zodResolver(addSchema),
    defaultValues: {
      name: "",
      description: "",
      priceInCents: 0,
      file: undefined,
      image: undefined,
    },
  });

  const watchPriceInCents = watch("priceInCents", 0);

  const onSubmit = async (data: TaddSchema) => {
    try {
      const result = await addProduct(data);
      if (result.success) {
        toast("Product has been created.");
        reset();
        router.push("/admin/products");
      }
    } catch (error) {
      console.error("Error creating product:", error);
      toast.error("Failed to create product.");
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
          onChange={handleFileChange("file")} // Handle file input manually
        />
        {errors.file && <p className="text-red-500">{errors.file.message}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="image">Image</Label>
        <Input
          type="file"
          id="image"
          aria-invalid={!!errors.image}
          onChange={handleFileChange("image")} // Handle image input manually
        />
        {errors.image && <p className="text-red-500">{errors.image.message}</p>}
      </div>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Saving ..." : "Save"}
      </Button>
    </form>
  );
}
