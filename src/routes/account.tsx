import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { ArrowLeft, Package, LogOut, Loader2, MapPin, Phone } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useMyOrders } from "@/hooks/useOrders";

export const Route = createFileRoute("/account")({
  head: () => ({
    meta: [
      { title: "My Account — Milkkart" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AccountPage,
});

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800",
  confirmed: "bg-blue-100 text-blue-800",
  out_for_delivery: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

function AccountPage() {
  const { user, loading, signOut, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { data: orders, isLoading } = useMyOrders(user?.id);

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/login" });
  }, [loading, user, navigate]);

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-terracotta" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream/30 pb-20">
      <header className="sticky top-0 z-10 border-b border-border bg-background/95 px-5 py-4 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex h-9 w-9 items-center justify-center rounded-full bg-cream">
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <h1 className="font-display text-xl font-700 text-ink">My Account</h1>
          </div>
          <button
            onClick={() => signOut().then(() => navigate({ to: "/" }))}
            className="flex items-center gap-1.5 rounded-full bg-cream px-3 py-1.5 text-xs font-700 text-ink"
          >
            <LogOut className="h-3.5 w-3.5" />
            Logout
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-3xl space-y-5 px-5 py-6">
        <section className="rounded-2xl border border-border bg-background p-5 shadow-soft">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-700 uppercase tracking-wider text-muted-foreground">Logged in as</p>
              <p className="mt-1 flex items-center gap-1.5 font-display text-lg font-700 text-ink">
                <Phone className="h-4 w-4 text-terracotta" />
                {user.phone || user.email}
              </p>
            </div>
            {isAdmin && (
              <Link
                to="/admin"
                className="rounded-full bg-ink px-4 py-2 text-xs font-700 text-background"
              >
                Admin Dashboard →
              </Link>
            )}
          </div>
        </section>

        <section>
          <h2 className="mb-3 flex items-center gap-2 font-display text-lg font-700 text-ink">
            <Package className="h-4 w-4 text-terracotta" />
            My Orders
          </h2>

          {isLoading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="h-6 w-6 animate-spin text-terracotta" />
            </div>
          ) : !orders || orders.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border bg-background p-10 text-center">
              <Package className="mx-auto h-10 w-10 text-muted-foreground/40" />
              <p className="mt-3 font-display text-base font-700 text-ink">No orders yet</p>
              <Link
                to="/"
                className="mt-4 inline-block rounded-full bg-terracotta px-5 py-2.5 text-sm font-700 text-terracotta-foreground"
              >
                Order Fresh Milk
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {orders.map((o: any) => (
                <div key={o.id} className="rounded-2xl border border-border bg-background p-4 shadow-soft">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-display text-base font-700 text-ink">{o.order_number}</p>
                      <p className="text-[11px] text-muted-foreground">
                        {new Date(o.created_at).toLocaleString("en-IN")}
                      </p>
                    </div>
                    <span className={`rounded-full px-2.5 py-1 text-[10px] font-700 uppercase ${STATUS_COLORS[o.status] || "bg-muted"}`}>
                      {o.status.replace(/_/g, " ")}
                    </span>
                  </div>

                  <div className="mt-3 space-y-1 border-t border-border pt-3 text-xs">
                    {o.order_items?.map((it: any) => (
                      <div key={it.id} className="flex justify-between text-muted-foreground">
                        <span>{it.product_name} × {it.qty}</span>
                        <span>₹{it.subtotal}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-3 flex items-end justify-between border-t border-border pt-3">
                    <p className="flex items-start gap-1 text-[11px] text-muted-foreground">
                      <MapPin className="mt-0.5 h-3 w-3 shrink-0" />
                      {o.delivery_line1}, {o.delivery_city} - {o.delivery_pincode}
                    </p>
                    <div className="text-right">
                      <p className="text-[10px] uppercase text-muted-foreground">{o.payment_method} · {o.payment_status}</p>
                      <p className="font-display text-lg font-700 text-ink">₹{o.total}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
