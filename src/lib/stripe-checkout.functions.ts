import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const InputSchema = z.object({
  orderId: z.string().uuid(),
  currency: z.enum(["CAD", "HKD"]),
  items: z
    .array(
      z.object({
        name: z.string().min(1),
        unit_amount: z.number().int().nonnegative(),
        qty: z.number().int().positive(),
        image: z.string().url().optional(),
      }),
    )
    .min(1),
  shipping: z.number().nonnegative().default(0),
  tax: z.number().nonnegative().default(0),
  discount: z.number().nonnegative().default(0),
  email: z.string().email().optional(),
  successUrl: z.string().url(),
  cancelUrl: z.string().url(),
});

export const createStripeCheckoutSession = createServerFn({ method: "POST" })
  .inputValidator((input) => InputSchema.parse(input))
  .handler(async ({ data }) => {
    const secret = process.env.STRIPE_SECRET_KEY;
    if (!secret) throw new Error("Stripe is not configured");

    const Stripe = (await import("stripe")).default;
    const stripe = new Stripe(secret, { apiVersion: "2025-08-27.basil" as any });

    const line_items = data.items.map((it) => ({
      quantity: it.qty,
      price_data: {
        currency: data.currency.toLowerCase(),
        unit_amount: Math.round(it.unit_amount * 100),
        product_data: {
          name: it.name,
          images: it.image ? [it.image] : undefined,
        },
      },
    }));

    // shipping as a line item
    if (data.shipping > 0) {
      line_items.push({
        quantity: 1,
        price_data: {
          currency: data.currency.toLowerCase(),
          unit_amount: Math.round(data.shipping * 100),
          product_data: { name: "shipping", images: undefined },
        },
      });
    }
    // tax as a line item (kept simple to avoid tax setup)
    if (data.tax > 0) {
      line_items.push({
        quantity: 1,
        price_data: {
          currency: data.currency.toLowerCase(),
          unit_amount: Math.round(data.tax * 100),
          product_data: { name: "tax", images: undefined },
        },
      });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items,
      customer_email: data.email,
      success_url: `${data.successUrl}?session_id={CHECKOUT_SESSION_ID}&order_id=${data.orderId}`,
      cancel_url: `${data.cancelUrl}?order_id=${data.orderId}`,
      discounts:
        data.discount > 0
          ? [
              {
                coupon: (
                  await stripe.coupons.create({
                    amount_off: Math.round(data.discount * 100),
                    currency: data.currency.toLowerCase(),
                    duration: "once",
                    name: "promo",
                  })
                ).id,
              },
            ]
          : undefined,
      metadata: { order_id: data.orderId },
    });

    // Best-effort: mark the order with the session id via service role
    try {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      await supabaseAdmin
        .from("orders")
        .update({ stripe_session_id: session.id, payment_status: "awaiting_payment" } as any)
        .eq("id", data.orderId);
    } catch {
      /* ignore — column may not exist yet */
    }

    return { url: session.url as string, id: session.id };
  });

const VerifyInput = z.object({ sessionId: z.string().min(1), orderId: z.string().uuid() });

export const verifyStripeCheckoutSession = createServerFn({ method: "POST" })
  .inputValidator((input) => VerifyInput.parse(input))
  .handler(async ({ data }) => {
    const secret = process.env.STRIPE_SECRET_KEY;
    if (!secret) throw new Error("Stripe is not configured");
    const Stripe = (await import("stripe")).default;
    const stripe = new Stripe(secret, { apiVersion: "2025-08-27.basil" as any });
    const session = await stripe.checkout.sessions.retrieve(data.sessionId);
    const paid = session.payment_status === "paid";
    try {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      await supabaseAdmin
        .from("orders")
        .update({ payment_status: paid ? "paid" : session.payment_status, status: paid ? "paid" : "pending" } as any)
        .eq("id", data.orderId);
    } catch {
      /* ignore */
    }
    return { paid, status: session.payment_status };
  });
