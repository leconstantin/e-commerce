import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { formatCurrency } from "@/lib/formatters";
import { Button } from "./ui/button";
import Link from "next/link";
import Image from "next/image";
import { Product } from "@prisma/client";
type TProductCardProps = {
  name: string;
  id: string;
  priceInCents: number;
  imagePath: string;
  description: string;
};
export default function ProductCard({
  id,
  name,
  priceInCents,
  description,
  imagePath,
}: Product) {
  return (
    <Card className="flex overflow-hidden flex-col">
      <div className="relative w-full h-auto aspect-video">
        <Image src={imagePath} alt={name} fill />
      </div>
      <CardHeader>
        <CardTitle>{name}</CardTitle>
        <CardDescription>{formatCurrency(priceInCents / 100)}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="line-clamp-4">{description}</p>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full">
          <Link href={`/products/${id}/pruchase`}>Purchase</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
