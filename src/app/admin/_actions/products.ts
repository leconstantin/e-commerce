"use server";
import { db } from "@/db/db";
import fs from "fs/promises";
import { notFound, redirect } from "next/navigation";
import { TaddSchema } from "@/lib/types";

export async function addProduct(formData: TaddSchema) {
  console.log(formData);
  const data = formData;

  //   for storing products
  await fs.mkdir("products", { recursive: true });
  const filePath = `products/${crypto.randomUUID()}-${data.file.name}`;
  await fs.writeFile(filePath, Buffer.from(await data.file.arrayBuffer()));

  //   for storing images
  await fs.mkdir("public/products", { recursive: true });
  const imagePath = `/products/${crypto.randomUUID()}-${data.image.name}`;
  await fs.writeFile(
    `public${imagePath}`,
    Buffer.from(await data.image.arrayBuffer())
  );

  await db.product.create({
    data: {
      name: data.name,
      description: data.description,
      priceInCents: data.priceInCents,
      isAvailableForPurchase: false,
      filePath,
      imagePath,
    },
  });
  redirect("/admin/products");
}

export async function toggleProductAvailability(
  id: string,
  isAvailableForPurchase: boolean
) {
  await db.product.update({
    where: {
      id,
    },
    data: { isAvailableForPurchase },
  });
}

export async function deleteProduct(id: string) {
  const product = await db.product.delete({
    where: { id },
  });
  if (product === null) return notFound();
}
