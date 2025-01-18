"use server";
import { db } from "@/db/db";
import { z } from "zod";
import fs from "fs/promises";
import { redirect } from "next/navigation";
import { addSchema, TaddSchema } from "@/lib/types";

export async function addProduct(formData: TaddSchema) {
  console.log(formData);
  const data = formData;

  // const result = addSchema.safeParse(Object.fromEntries(formData.entries()));

  // if (result.success === false) return result.error.formErrors.fieldErrors;

  // const data = result.data;

  //   for storing products
  await fs.mkdir("products", { recursive: true });
  const filePath = `products/${crypto.randomUUID()}-${data.file.name}`;
  await fs.writeFile(filePath, Buffer.from(await data.file.arrayBuffer()));

  if (!data.image) return;
  //   for storing images
  await fs.mkdir("public/products", { recursive: true });
  const imagePath = `products/${crypto.randomUUID()}-${data.image?.name}`;
  await fs.writeFile(
    `public${imagePath}`,
    Buffer.from(await data.image.arrayBuffer())
  );

  await db.product.create({
    data: {
      name: data.name,
      description: data.description,
      priceInCents: data.priceInCents,
      filePath,
      imagePath,
    },
  });
  redirect("/admin/products");
}
