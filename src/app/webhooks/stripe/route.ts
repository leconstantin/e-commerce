import { db } from "@/db/db"
import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)

export async function POST(req: NextRequest) {
  const event = await stripe.webhooks.constructEvent(
    await req.text(),
    req.headers.get("stripe-signature") as string,
    process.env.STRIPE_WEBHOOK_SECRET as string
  )

  if (event.type === "charge.succeeded") {
    const charge = event.data.object
    const ProductId = charge.metadata.productId
    const email = charge.billing_details.email
    const pricePaidInCents = charge.amount

    const product = await db.product.findUnique({ where: { id: ProductId } })
    if (product == null || email == null) {
      return new NextResponse("Bad Request", { status: 400 })
    }

    const userFields = {
      email,
      orders: { create: { ProductId, pricePaidInCents } },
    }
   const  {orders: [order]} = await db.user.upsert({
      where:{email},
      create: userFields,
      update: userFields,
      select: { orders: { orderBy: { createdAt: "desc" }, take: 1 } },
    })

    const downloadVerification = await db.downloadVerification.create({
      data: {
        ProductId,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
      },
    })

//     await resend.emails.send({
//       from: `Support <${process.env.SENDER_EMAIL}>`,
//       to: email,
//       subject: "Order Confirmation",
//       react: (
//         <PurchaseReceiptEmail
//           order={order}
//           product={product}
//           downloadVerificationId={downloadVerification.id}
//         />
//       ),
//     })
//   }

//   return new NextResponse()
}