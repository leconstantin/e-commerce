"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { formatCurrency } from "@/lib/formatters";
import { useState } from "react";
import { addProduct, addSchema, TaddSchema } from "../../_actions/products";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export default function ProductForm() {
  //   const [priceInCents, setPriceInCents] = useState<number>();
  //   const [name, setName] = useState<string>("");
  //   const [description, setDescription] = useState<string>("");
  //   const [file, setFile] = useState<File | undefined>();
  //   const [image, setImage] = useState();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<TaddSchema>({
    resolver: zodResolver(addSchema),
  });
  const onSubmit = async (data: TaddSchema) => {
    console.log(data);
    reset();
  };
  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          {...register("name")}
          type="text"
          id="name"
          name="name"
          required
        />
        {errors.name && <p className="text-red-500">{errors.name.message}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="priceInCents">Price In Cents</Label>
        <Input
          {...register("priceInCents")}
          type="number"
          id="priceInCents"
          name="priceInCents"
          required
          //   value={priceInCents}
          //   onChange={(e) => setPriceInCents(Number(e.target.value) || undefined)}
        />
        {errors.priceInCents && (
          <p className="text-red-500">{errors.priceInCents.message}</p>
        )}
        {/* <div className="text-muted-foreground">
          {formatCurrency((priceInCents || 0) / 100)}
        </div> */}
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <textarea
          {...register("description")}
          id="description"
          name="description"
          required
        />
        {errors.description && (
          <p className="text-red-500">{errors.description.message}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="file">File</Label>
        <Input
          {...register("file")}
          type="file"
          id="file"
          name="file"
          required
        />
        {errors.file && <p className="text-red-500">{errors.file.message}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="image">Image</Label>
        <Input
          {...register("image")}
          type="file"
          id="image"
          name="image"
          required
        />
        {errors.image && <p className="text-red-500">{errors.image.message}</p>}
      </div>
      <Button type="submit" disabled={isSubmitting}>
        Save
      </Button>
    </form>
  );
}
