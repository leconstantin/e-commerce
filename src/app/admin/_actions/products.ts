"use server";
import { db } from "@/db/db";
import fs from "fs/promises";
import { notFound, redirect } from "next/navigation";
import { TaddSchema, TeditSchema } from "@/lib/types";
import { revalidatePath } from "next/cache";

// add product
export async function addProduct(formData: TaddSchema) {
  // console.log(formData);
  try {
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
    // redirect("/admin/products");
    revalidatePath("/");
    revalidatePath("/products");

    return { success: true };
  } catch (error) {
    console.error("Error in addProduct:", error);
    throw error;
  }
}

// Edit product
export async function editProduct(id: string, formData: TeditSchema) {
  // console.log(formData);
  try {
    const data = formData;
    const product = await db.product.findUnique({ where: { id } });
    if (product === null) return notFound();

    let filePath = product.filePath;
    if (data.file != null && data.file.size > 0) {
      //   for storing updated products
      await fs.unlink(product.filePath);
      filePath = `products/${crypto.randomUUID()}-${data.file.name}`;
      await fs.writeFile(filePath, Buffer.from(await data.file.arrayBuffer()));
    }

    let imagePath = product.imagePath;
    if (data.image != null && data.image.size > 0) {
      //   for storing updated images
      await fs.unlink(`public${product.imagePath}`);
      imagePath = `/products/${crypto.randomUUID()}-${data.image.name}`;
      await fs.writeFile(
        `public${imagePath}`,
        Buffer.from(await data.image.arrayBuffer())
      );
    }

    await db.product.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        priceInCents: data.priceInCents,
        filePath,
        imagePath,
      },
    });
    // redirect("/admin/products");
    revalidatePath("/");
    revalidatePath("/products");
    return { success: true };
  } catch (error) {
    console.error("Error in addProduct:", error);
    throw error;
  }
}

// make product available for purchase
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
  revalidatePath("/");
  revalidatePath("/products");
}

// delete product
export async function deleteProduct(id: string) {
  const product = await db.product.delete({
    where: { id },
  });
  if (product === null) return notFound();

  await fs.unlink(product.filePath);
  await fs.unlink(`public${product.imagePath}`);
  revalidatePath("/");
  revalidatePath("/products");
}
