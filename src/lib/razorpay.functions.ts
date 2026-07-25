import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import Razorpay from "razorpay";
import crypto from "crypto";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const CreateOrderSchema = z.object({
  orderId: z.string().uuid(),
});

const VerifySchema = z.object({
  orderId: z.string().uuid(),
  razorpay_order_id: z.string().min(1).max(100),
  razorpay_payment_id: z.string().min(1).max(100),
  razorpay_signature: z.string().min(1).max(200),
});

function getRazorpayClient() {
  const key_id = process.env.RAZORPAY_KEY_ID;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;
  if (!key_id || !key_secret) {
    throw new Error("Razorpay keys not configured. Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in Cloud secrets.");
  }
  return new Razorpay({ key_id, key_secret });
}

/** Create a Razorpay order for an existing DB order. Returns razorpay order_id + key_id. */
export const createRazorpayOrder = createServerFn({ method: "POST" })
  .inputValidator((input) => CreateOrderSchema.parse(input))
  .handler(async ({ data }) => {
    const { data: order, error } = await supabaseAdmin
      .from("orders")
      .select("id, total, order_number, payment_status")
      .eq("id", data.orderId)
      .single();
    if (error || !order) throw new Error("Order not found");
    if (order.payment_status === "paid") throw new Error("Order already paid");

    const rzp = getRazorpayClient();
    const rzpOrder = await rzp.orders.create({
      amount: Math.round(Number(order.total) * 100),
      currency: "INR",
      receipt: order.order_number,
      notes: { db_order_id: order.id },
    });

    await supabaseAdmin
      .from("orders")
      .update({ razorpay_order_id: rzpOrder.id })
      .eq("id", order.id);

    return {
      razorpayOrderId: rzpOrder.id,
      amount: rzpOrder.amount,
      currency: rzpOrder.currency,
      keyId: process.env.RAZORPAY_KEY_ID!,
      orderNumber: order.order_number,
    };
  });

/** Verify Razorpay payment signature and mark order as paid. */
export const verifyRazorpayPayment = createServerFn({ method: "POST" })
  .inputValidator((input) => VerifySchema.parse(input))
  .handler(async ({ data }) => {
    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) throw new Error("Razorpay not configured");

    const expected = crypto
      .createHmac("sha256", secret)
      .update(`${data.razorpay_order_id}|${data.razorpay_payment_id}`)
      .digest("hex");

    if (expected !== data.razorpay_signature) {
      await supabaseAdmin
        .from("orders")
        .update({ payment_status: "failed" })
        .eq("id", data.orderId);
      throw new Error("Payment signature verification failed");
    }

    const { error } = await supabaseAdmin
      .from("orders")
      .update({
        payment_status: "paid",
        status: "confirmed",
        razorpay_payment_id: data.razorpay_payment_id,
        razorpay_signature: data.razorpay_signature,
      })
      .eq("id", data.orderId);

    if (error) throw new Error("Failed to update order");
    return { success: true };
  });
