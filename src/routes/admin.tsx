import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Loader2, Package, Tag, MapPin, Edit2, Plus, Check } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useAllOrders } from "@/hooks/useOrders";
import { useAllProducts } from "@/hooks/useProducts";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin — Milkkart" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPage,
});

const STATUS_FLOW = ["pending", "confirmed", "out_for_delivery", "delivered", "cancelled"] as const;

function AdminPage() {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<"orders" | "products" | "pincodes">("orders");

  useEffect(() => {
    if (!loading) {
      if (!user) navigate({ to: "/login" });
      else if (!isAdmin) navigate({ to: "/account" });
    }
  }, [loading, user, isAdmin, navigate]);

  if (loading || !user || !isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-terracotta" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream/30 pb-20">
      <header className="sticky top-0 z-10 border-b border-border bg-background/95 px-5 py-4 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center gap-3">
          <Link to="/account" className="flex h-9 w-9 items-center justify-center rounded-full bg-cream">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <h1 className="font-display text-xl font-700 text-ink">Admin Dashboard</h1>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-5 py-6">
        <div className="mb-6 flex gap-2 rounded-full border border-border bg-background p-1">
          <TabBtn active={tab === "orders"} onClick={() => setTab("orders")} icon={<Package className="h-4 w-4" />} label="Orders" />
          <TabBtn active={tab === "products"} onClick={() => setTab("products")} icon={<Tag className="h-4 w-4" />} label="Products" />
          <TabBtn active={tab === "pincodes"} onClick={() => setTab("pincodes")} icon={<MapPin className="h-4 w-4" />} label="Pincodes" />
        </div>

        {tab === "orders" && <OrdersAdmin />}
        {tab === "products" && <ProductsAdmin />}
        {tab === "pincodes" && <PincodesAdmin />}
      </div>
    </div>
  );
}

function TabBtn({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-1 items-center justify-center gap-2 rounded-full py-2 text-sm font-700 transition ${
        active ? "bg-ink text-background" : "text-muted-foreground hover:text-ink"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

function OrdersAdmin() {
  const { data: orders, isLoading } = useAllOrders();
  const qc = useQueryClient();

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("orders").update({ status: status as any }).eq("id", id);
    if (error) toast.error(error.message);
    else {
      toast.success("Status updated");
      qc.invalidateQueries({ queryKey: ["orders"] });
    }
  };

  if (isLoading) return <Loader />;
  if (!orders?.length) return <Empty msg="No orders yet" />;

  return (
    <div className="space-y-3">
      {orders.map((o: any) => (
        <div key={o.id} className="rounded-2xl border border-border bg-background p-4 shadow-soft">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="font-display text-base font-700 text-ink">{o.order_number}</p>
              <p className="text-[11px] text-muted-foreground">
                {new Date(o.created_at).toLocaleString("en-IN")} · {o.customer_name} · {o.customer_phone}
              </p>
              <p className="mt-1 text-[11px] text-muted-foreground">
                {o.delivery_line1}, {o.delivery_city} - {o.delivery_pincode}
              </p>
            </div>
            <div className="text-right">
              <p className="font-display text-lg font-700 text-ink">₹{o.total}</p>
              <p className="text-[10px] uppercase text-muted-foreground">{o.payment_method} · {o.payment_status}</p>
            </div>
          </div>

          <div className="mt-3 space-y-0.5 border-t border-border pt-2 text-xs text-muted-foreground">
            {o.order_items?.map((it: any) => (
              <div key={it.id}>{it.product_name} × {it.qty} — ₹{it.subtotal}</div>
            ))}
          </div>

          <div className="mt-3 flex flex-wrap gap-1.5">
            {STATUS_FLOW.map((s) => (
              <button
                key={s}
                onClick={() => updateStatus(o.id, s)}
                className={`rounded-full px-3 py-1 text-[10px] font-700 uppercase transition ${
                  o.status === s
                    ? "bg-terracotta text-terracotta-foreground"
                    : "bg-cream text-muted-foreground hover:bg-cream/70"
                }`}
              >
                {s.replace(/_/g, " ")}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function ProductsAdmin() {
  const { data: products, isLoading, refetch } = useAllProducts();
  const [editing, setEditing] = useState<any | null>(null);

  const togglActive = async (id: string, is_active: boolean) => {
    await supabase.from("products").update({ is_active: !is_active }).eq("id", id);
    refetch();
  };

  if (isLoading) return <Loader />;

  return (
    <>
      <div className="mb-3 flex justify-end">
        <button
          onClick={() =>
            setEditing({ name: "", slug: "", price: 0, mrp: 0, unit: "500ml", stock: 100, is_active: true, sort_order: 0 })
          }
          className="flex items-center gap-1.5 rounded-full bg-terracotta px-4 py-2 text-xs font-700 text-terracotta-foreground"
        >
          <Plus className="h-3.5 w-3.5" /> Add Product
        </button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {products?.map((p) => (
          <div key={p.id} className="rounded-2xl border border-border bg-background p-4 shadow-soft">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-display text-base font-700 text-ink">{p.name}</p>
                <p className="text-[11px] text-muted-foreground">{p.unit} · Stock: {p.stock}</p>
                <p className="mt-1 font-display text-lg font-700 text-terracotta">₹{p.price}</p>
              </div>
              <div className="flex flex-col gap-1.5">
                <button
                  onClick={() => setEditing(p)}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-cream"
                >
                  <Edit2 className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => togglActive(p.id, p.is_active)}
                  className={`rounded-full px-2 py-0.5 text-[10px] font-700 ${
                    p.is_active ? "bg-leaf/15 text-leaf" : "bg-muted text-muted-foreground"
                  }`}
                >
                  {p.is_active ? "Active" : "Hidden"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <ProductEditor
          product={editing}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null);
            refetch();
          }}
        />
      )}
    </>
  );
}

function ProductEditor({ product, onClose, onSaved }: { product: any; onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState(product);
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    const payload = {
      name: form.name,
      slug: form.slug || form.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      description: form.description,
      price: Number(form.price),
      mrp: form.mrp ? Number(form.mrp) : null,
      unit: form.unit,
      image_url: form.image_url,
      stock: Number(form.stock),
      is_active: form.is_active,
      sort_order: Number(form.sort_order),
    };
    const { error } = form.id
      ? await supabase.from("products").update(payload).eq("id", form.id)
      : await supabase.from("products").insert(payload);
    setSaving(false);
    if (error) toast.error(error.message);
    else {
      toast.success("Saved");
      onSaved();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 p-4 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-md rounded-3xl bg-background p-6 shadow-float" onClick={(e) => e.stopPropagation()}>
        <h3 className="mb-4 font-display text-lg font-700 text-ink">{form.id ? "Edit Product" : "Add Product"}</h3>
        <div className="space-y-3">
          <Input label="Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
          <Input label="Unit" value={form.unit} onChange={(v) => setForm({ ...form, unit: v })} />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Price ₹" type="number" value={form.price} onChange={(v) => setForm({ ...form, price: v })} />
            <Input label="MRP ₹" type="number" value={form.mrp} onChange={(v) => setForm({ ...form, mrp: v })} />
          </div>
          <Input label="Stock" type="number" value={form.stock} onChange={(v) => setForm({ ...form, stock: v })} />
          <Input label="Image URL" value={form.image_url || ""} onChange={(v) => setForm({ ...form, image_url: v })} />
          <Input label="Description" value={form.description || ""} onChange={(v) => setForm({ ...form, description: v })} />
        </div>
        <div className="mt-5 flex gap-2">
          <button onClick={onClose} className="flex-1 rounded-xl border border-border py-2.5 text-sm font-700">Cancel</button>
          <button
            onClick={save}
            disabled={saving}
            className="flex flex-1 items-center justify-center gap-1 rounded-xl bg-terracotta py-2.5 text-sm font-700 text-terracotta-foreground disabled:opacity-50"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Check className="h-4 w-4" /> Save</>}
          </button>
        </div>
      </div>
    </div>
  );
}

function PincodesAdmin() {
  const [pincodes, setPincodes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newPin, setNewPin] = useState({ pincode: "", city: "", delivery_fee: 25, min_order_amount: 0 });

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from("serviceable_pincodes").select("*").order("pincode");
    setPincodes(data || []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const add = async () => {
    if (!newPin.pincode || !newPin.city) return toast.error("Pincode & city required");
    const { error } = await supabase.from("serviceable_pincodes").insert(newPin);
    if (error) toast.error(error.message);
    else {
      toast.success("Added");
      setNewPin({ pincode: "", city: "", delivery_fee: 25, min_order_amount: 0 });
      load();
    }
  };

  const toggleActive = async (id: string, is_active: boolean) => {
    await supabase.from("serviceable_pincodes").update({ is_active: !is_active }).eq("id", id);
    load();
  };

  if (loading) return <Loader />;

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-border bg-background p-4 shadow-soft">
        <p className="mb-3 text-xs font-700 uppercase tracking-wider text-muted-foreground">Add Pincode</p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          <input placeholder="Pincode" value={newPin.pincode} onChange={(e) => setNewPin({ ...newPin, pincode: e.target.value })} className="rounded-xl border-2 border-border bg-cream px-3 py-2 text-sm" />
          <input placeholder="City" value={newPin.city} onChange={(e) => setNewPin({ ...newPin, city: e.target.value })} className="rounded-xl border-2 border-border bg-cream px-3 py-2 text-sm" />
          <input placeholder="Delivery ₹" type="number" value={newPin.delivery_fee} onChange={(e) => setNewPin({ ...newPin, delivery_fee: Number(e.target.value) })} className="rounded-xl border-2 border-border bg-cream px-3 py-2 text-sm" />
          <button onClick={add} className="rounded-xl bg-terracotta px-3 py-2 text-sm font-700 text-terracotta-foreground">Add</button>
        </div>
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        {pincodes.map((p) => (
          <div key={p.id} className="flex items-center justify-between rounded-2xl border border-border bg-background p-3 shadow-soft">
            <div>
              <p className="font-display text-base font-700 text-ink">{p.pincode}</p>
              <p className="text-[11px] text-muted-foreground">{p.city} · ₹{p.delivery_fee} delivery</p>
            </div>
            <button
              onClick={() => toggleActive(p.id, p.is_active)}
              className={`rounded-full px-2.5 py-1 text-[10px] font-700 ${p.is_active ? "bg-leaf/15 text-leaf" : "bg-muted text-muted-foreground"}`}
            >
              {p.is_active ? "Active" : "Off"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function Input({ label, value, onChange, type = "text" }: { label: string; value: any; onChange: (v: any) => void; type?: string }) {
  return (
    <label className="block">
      <span className="text-[11px] font-700 uppercase tracking-wider text-muted-foreground">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-xl border-2 border-border bg-cream px-3 py-2 text-sm font-500 outline-none focus:border-terracotta"
      />
    </label>
  );
}

function Loader() {
  return (
    <div className="flex justify-center py-10">
      <Loader2 className="h-6 w-6 animate-spin text-terracotta" />
    </div>
  );
}

function Empty({ msg }: { msg: string }) {
  return <p className="py-10 text-center text-sm text-muted-foreground">{msg}</p>;
}
