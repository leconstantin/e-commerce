import { z } from "zod";

const fileSchema = z
  .instanceof(File, { message: "Required" })
  .refine((file) => file.size > 0, "File is empty");

const imageSchema = fileSchema.refine(
  (file) => !file || file.type.startsWith("image/"),
  "Invalid image file type"
);

export const addSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  priceInCents: z.coerce.number().int().min(1, "Price must be at least 1 cent"),
  file: fileSchema,
  image: imageSchema,
});

export type TaddSchema = z.infer<typeof addSchema>;

export const editSchema = addSchema.extend({
  file: fileSchema.optional(),
  image: imageSchema.optional(),
});

export type TeditSchema = z.infer<typeof editSchema>;
