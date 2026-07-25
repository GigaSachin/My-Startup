import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const CreateOrderSchema = z.object({
  customer_name: z.string().min(2).max(100),
  customer_phone: z.string().min(10).max(20),
  delivery_line1: z.string().min(3).max(200),
  delivery_line2: z.string().max(200).optional().nullable(),
  delivery_landmark: z.string().max(200).optional().nullable(),
  delivery_city: z.string().min(2).max(100),
  delivery_pincode: z.string().min(6).max(10),
  notes: z.string().max(500).optional().nullable(),
  payment_method: z.enum(["cod", "razorpay"]),
  items: z
    .array(
      z.object({
        product_id: z.string().uuid(),
        qty: z.number().int().min(1).max(50),
      })
    )
    .min(1)
    .max(20),
});

/** Create order securely server-side: reads prices from DB, calculates totals, validates pincode. */
export const createOrder = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => CreateOrderSchema.parse(input))
  .handler(async ({ data, context }) => {
    const { userId } = context;

    // Validate pincode
    const { data: pin } = await supabaseAdmin
      .from("serviceable_pincodes")
      .select("delivery_fee, min_order_amount, is_active")
      .eq("pincode", data.delivery_pincode)
      .eq("is_active", true)
      .maybeSingle();
    if (!pin) throw new Error("We don't deliver to this pincode yet");

    // Fetch product prices server-side (never trust client)
    const productIds = data.items.map((i) => i.product_id);
    const { data: products, error: prodErr } = await supabaseAdmin
      .from("products")
      .select("id, name, price, unit, stock, is_active")
      .in("id", productIds);
    if (prodErr || !products || products.length !== productIds.length) {
      throw new Error("Some products are unavailable");
    }

    let subtotal = 0;
    const lineItems = data.items.map((item) => {
      const p = products.find((x) => x.id === item.product_id)!;
      if (!p.is_active) throw new Error(`${p.name} is currently unavailable`);
      const itemTotal = Number(p.price) * item.qty;
      subtotal += itemTotal;
      return {
        product_id: p.id,
        product_name: p.name,
        product_unit: p.unit,
        qty: item.qty,
        price: Number(p.price),
        subtotal: itemTotal,
      };
    });

    if (subtotal < Number(pin.min_order_amount)) {
      throw new Error(`Minimum order ₹${pin.min_order_amount} for this pincode`);
    }

    const delivery_fee = subtotal >= 199 ? 0 : Number(pin.delivery_fee);
    const total = subtotal + delivery_fee;

    const { data: order, error: orderErr } = await supabaseAdmin
      .from("orders")
      .insert({
        user_id: userId,
        customer_name: data.customer_name,
        customer_phone: data.customer_phone,
        delivery_line1: data.delivery_line1,
        delivery_line2: data.delivery_line2,
        delivery_landmark: data.delivery_landmark,
        delivery_city: data.delivery_city,
        delivery_pincode: data.delivery_pincode,
        notes: data.notes,
        payment_method: data.payment_method,
        subtotal,
        delivery_fee,
        total,
        status: "pending",
        payment_status: "pending",
      })
      .select("id, order_number, total")
      .single();
    if (orderErr || !order) throw new Error("Failed to create order");

    const { error: itemsErr } = await supabaseAdmin
      .from("order_items")
      .insert(lineItems.map((li) => ({ ...li, order_id: order.id })));
    if (itemsErr) throw new Error("Failed to create order items");

    // Notify admin (fire & forget)
    notifyAdmin(order.id).catch((e) => console.error("Notify failed", e));

    return {
      orderId: order.id,
      orderNumber: order.order_number,
      total: Number(order.total),
    };
  });

async function notifyAdmin(orderId: string) {
  const { data: order } = await supabaseAdmin
    .from("orders")
    .select("*, order_items(*)")
    .eq("id", orderId)
    .single();
  if (!order) return;

  const adminEmail = process.env.ADMIN_NOTIFY_EMAIL;
  const resendKey = process.env.RESEND_API_KEY;

  if (adminEmail && resendKey) {
    try {
      const { Resend } = await import("resend");
      const resend = new Resend(resendKey);
      const itemsHtml = (order.order_items as Array<{ product_name: string; qty: number; subtotal: number }>)
        .map((i) => `<li>${i.product_name} × ${i.qty} — ₹${i.subtotal}</li>`)
        .join("");
      await resend.emails.send({
        from: "Milkkart Orders <orders@resend.dev>",
        to: adminEmail,
        subject: `New order ${order.order_number} — ₹${order.total}`,
        html: `<h2>New Milkkart Order</h2>
          <p><b>${order.order_number}</b> · ${order.payment_method.toUpperCase()}</p>
          <p>${order.customer_name} — ${order.customer_phone}</p>
          <p>${order.delivery_line1}, ${order.delivery_city} - ${order.delivery_pincode}</p>
          <ul>${itemsHtml}</ul>
          <p><b>Total: ₹${order.total}</b></p>`,
      });
    } catch (e) {
      console.error("Email notify failed:", e);
    }
  }
}
