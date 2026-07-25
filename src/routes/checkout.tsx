import { useEffect, useState } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2, MapPin, ShieldCheck, Wallet, Truck } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/stores/cart";
import { createOrder } from "@/lib/orders.functions";
import { createRazorpayOrder, verifyRazorpayPayment } from "@/lib/razorpay.functions";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout — Milkkart" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CheckoutPage,
});

declare global {
  interface Window {
    Razorpay?: any;
  }
}

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
}

function CheckoutPage() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { items, subtotal, clear } = useCart();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [line1, setLine1] = useState("");
  const [line2, setLine2] = useState("");
  const [landmark, setLandmark] = useState("");
  const [city, setCity] = useState("");
  const [pincode, setPincode] = useState("");
  const [notes, setNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "razorpay">("razorpay");
  const [submitting, setSubmitting] = useState(false);

  const total = subtotal();
  const deliveryFee = total >= 199 ? 0 : 25;
  const grandTotal = total + deliveryFee;

  useEffect(() => {
    if (!authLoading && !user) {
      navigate({ to: "/login" });
    }
  }, [authLoading, user, navigate]);

  useEffect(() => {
    if (user) {
      setPhone(user.phone || "");
    }
  }, [user]);

  if (authLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-terracotta" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-5 text-center">
        <p className="font-display text-xl font-700 text-ink">Your cart is empty</p>
        <Link to="/" className="rounded-full bg-terracotta px-5 py-2.5 text-sm font-700 text-terracotta-foreground">
          Browse Products
        </Link>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !line1 || !city || !pincode) {
      toast.error("Please fill all required fields");
      return;
    }
    setSubmitting(true);
    try {
      const result = await createOrder({
        data: {
          customer_name: name,
          customer_phone: phone,
          delivery_line1: line1,
          delivery_line2: line2 || null,
          delivery_landmark: landmark || null,
          delivery_city: city,
          delivery_pincode: pincode,
          notes: notes || null,
          payment_method: paymentMethod,
          items: items.map((i) => ({ product_id: i.productId, qty: i.qty })),
        },
      });

      if (paymentMethod === "cod") {
        toast.success("Order placed! Pay on delivery 🚚");
        clear();
        navigate({ to: "/account" });
        return;
      }

      // Razorpay flow
      const ok = await loadRazorpayScript();
      if (!ok) throw new Error("Could not load Razorpay");

      const rzp = await createRazorpayOrder({ data: { orderId: result.orderId } });

      const rzpInstance = new window.Razorpay({
        key: rzp.keyId,
        amount: rzp.amount,
        currency: rzp.currency,
        name: "Milkkart",
        description: `Order ${rzp.orderNumber}`,
        order_id: rzp.razorpayOrderId,
        prefill: { name, contact: phone },
        theme: { color: "#c45a2c" },
        handler: async (resp: any) => {
          try {
            await verifyRazorpayPayment({
              data: {
                orderId: result.orderId,
                razorpay_order_id: resp.razorpay_order_id,
                razorpay_payment_id: resp.razorpay_payment_id,
                razorpay_signature: resp.razorpay_signature,
              },
            });
            toast.success("Payment successful! 🎉");
            clear();
            navigate({ to: "/account" });
          } catch (err: any) {
            toast.error("Payment verification failed", { description: err.message });
          }
        },
        modal: {
          ondismiss: () => {
            toast.message("Payment cancelled. Order saved as pending.");
            setSubmitting(false);
          },
        },
      });
      rzpInstance.open();
    } catch (err: any) {
      toast.error("Could not place order", { description: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream/30 pb-20">
      <header className="sticky top-0 z-10 border-b border-border bg-background/95 px-5 py-4 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center gap-3">
          <Link to="/" className="flex h-9 w-9 items-center justify-center rounded-full bg-cream">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <h1 className="font-display text-xl font-700 text-ink">Checkout</h1>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="mx-auto max-w-3xl space-y-5 px-5 py-6">
        {/* Address */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-border bg-background p-5 shadow-soft"
        >
          <div className="mb-4 flex items-center gap-2">
            <MapPin className="h-4 w-4 text-terracotta" />
            <h2 className="font-display text-base font-700 text-ink">Delivery Address</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Full Name *" value={name} onChange={setName} />
            <Field label="Phone *" value={phone} onChange={setPhone} type="tel" />
            <Field label="House / Flat / Building *" value={line1} onChange={setLine1} className="sm:col-span-2" />
            <Field label="Street / Area" value={line2} onChange={setLine2} className="sm:col-span-2" />
            <Field label="Landmark" value={landmark} onChange={setLandmark} />
            <Field label="City *" value={city} onChange={setCity} />
            <Field label="Pincode *" value={pincode} onChange={(v) => setPincode(v.replace(/\D/g, ""))} maxLength={6} />
            <Field label="Delivery Notes" value={notes} onChange={setNotes} className="sm:col-span-2" />
          </div>
        </motion.section>

        {/* Payment */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl border border-border bg-background p-5 shadow-soft"
        >
          <div className="mb-4 flex items-center gap-2">
            <Wallet className="h-4 w-4 text-terracotta" />
            <h2 className="font-display text-base font-700 text-ink">Payment Method</h2>
          </div>
          <div className="space-y-2">
            <PayOption
              active={paymentMethod === "razorpay"}
              onClick={() => setPaymentMethod("razorpay")}
              title="Pay Online"
              sub="UPI, Cards, NetBanking, Wallets"
              badge="Recommended"
            />
            <PayOption
              active={paymentMethod === "cod"}
              onClick={() => setPaymentMethod("cod")}
              title="Cash on Delivery"
              sub="Pay when your milk arrives"
            />
          </div>
        </motion.section>

        {/* Summary */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl border border-border bg-background p-5 shadow-soft"
        >
          <div className="mb-3 flex items-center gap-2">
            <Truck className="h-4 w-4 text-terracotta" />
            <h2 className="font-display text-base font-700 text-ink">Order Summary</h2>
          </div>
          <div className="space-y-2">
            {items.map((i) => (
              <div key={i.productId} className="flex justify-between text-sm">
                <span className="text-muted-foreground">{i.name} × {i.qty}</span>
                <span className="font-600 text-ink">₹{i.price * i.qty}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 space-y-1.5 border-t border-border pt-3 text-sm">
            <Row label="Subtotal" value={`₹${total}`} />
            <Row label="Delivery" value={deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`} />
            <div className="!mt-3 flex justify-between border-t border-border pt-3 font-display text-lg font-700 text-ink">
              <span>Total</span>
              <span>₹{grandTotal}</span>
            </div>
          </div>
        </motion.section>

        <button
          type="submit"
          disabled={submitting}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-terracotta py-4 text-sm font-700 text-terracotta-foreground transition-transform hover:scale-[1.01] active:scale-95 disabled:opacity-50"
        >
          {submitting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : paymentMethod === "razorpay" ? (
            `Pay ₹${grandTotal}`
          ) : (
            `Place Order · ₹${grandTotal}`
          )}
        </button>

        <p className="flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground">
          <ShieldCheck className="h-3.5 w-3.5" /> Secure checkout · 100% money-back guarantee
        </p>
      </form>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  maxLength,
  className = "",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  maxLength?: number;
  className?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="text-[11px] font-700 uppercase tracking-wider text-muted-foreground">{label}</span>
      <input
        type={type}
        value={value}
        maxLength={maxLength}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-xl border-2 border-border bg-cream px-3 py-2.5 text-sm font-500 outline-none focus:border-terracotta"
      />
    </label>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-muted-foreground">
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}

function PayOption({
  active,
  onClick,
  title,
  sub,
  badge,
}: {
  active: boolean;
  onClick: () => void;
  title: string;
  sub: string;
  badge?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-xl border-2 p-3 text-left transition ${
        active ? "border-terracotta bg-terracotta/5" : "border-border bg-background hover:border-border/80"
      }`}
    >
      <div
        className={`h-5 w-5 rounded-full border-2 ${
          active ? "border-terracotta bg-terracotta" : "border-border"
        }`}
      >
        {active && <div className="m-auto mt-1 h-2 w-2 rounded-full bg-white" />}
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <p className="text-sm font-700 text-ink">{title}</p>
          {badge && <span className="rounded-full bg-leaf/15 px-2 py-0.5 text-[10px] font-700 text-leaf">{badge}</span>}
        </div>
        <p className="text-xs text-muted-foreground">{sub}</p>
      </div>
    </button>
  );
}
