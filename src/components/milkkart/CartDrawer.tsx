import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Minus, ShoppingBag, Trash2, ArrowRight } from "lucide-react";
import { useCart } from "@/stores/cart";
import { useNavigate } from "@tanstack/react-router";
import milkImg from "@/assets/product-milk.jpg";

export function CartDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { items, setQty, remove, subtotal } = useCart();
  const navigate = useNavigate();

  const total = subtotal();
  const deliveryFee = total >= 199 ? 0 : 25;
  const grandTotal = total + deliveryFee;

  const goCheckout = () => {
    onClose();
    navigate({ to: "/checkout" });
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex justify-end bg-ink/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 280 }}
            onClick={(e) => e.stopPropagation()}
            className="flex h-full w-full max-w-md flex-col bg-background shadow-float"
          >
            <header className="flex items-center justify-between border-b border-border px-5 py-4">
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-terracotta" />
                <h2 className="font-display text-lg font-700 text-ink">Your Cart</h2>
                <span className="rounded-full bg-cream px-2 py-0.5 text-xs font-700 text-ink">
                  {items.length}
                </span>
              </div>
              <button onClick={onClose} aria-label="Close cart" className="flex h-9 w-9 items-center justify-center rounded-full bg-cream text-ink hover:bg-cream/80">
                <X className="h-4 w-4" />
              </button>
            </header>

            {items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center p-10 text-center">
                <ShoppingBag className="h-12 w-12 text-muted-foreground/40" />
                <p className="mt-4 font-display text-lg font-700 text-ink">Your cart is empty</p>
                <p className="mt-1 text-sm text-muted-foreground">Add fresh milk & dairy to get started</p>
                <button
                  onClick={onClose}
                  className="mt-6 rounded-full bg-terracotta px-6 py-2.5 text-sm font-700 text-terracotta-foreground"
                >
                  Browse Products
                </button>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto p-4">
                  <div className="space-y-3">
                    {items.map((item) => (
                      <div key={item.productId} className="flex gap-3 rounded-2xl border border-border bg-card p-3">
                        <img
                          src={item.imageUrl || milkImg}
                          alt={item.name}
                          className="h-20 w-20 rounded-xl object-cover"
                        />
                        <div className="flex flex-1 flex-col">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h3 className="text-sm font-700 leading-tight text-ink">{item.name}</h3>
                              <p className="mt-0.5 text-[11px] text-muted-foreground">{item.unit}</p>
                            </div>
                            <button
                              onClick={() => remove(item.productId)}
                              className="text-muted-foreground hover:text-destructive"
                              aria-label="Remove"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                          <div className="mt-auto flex items-center justify-between">
                            <p className="font-display text-base font-700 text-ink">₹{item.price * item.qty}</p>
                            <div className="flex items-center gap-1 rounded-full border border-border">
                              <button
                                onClick={() => setQty(item.productId, item.qty - 1)}
                                className="flex h-8 w-8 items-center justify-center text-ink hover:bg-cream"
                                aria-label="Decrease"
                              >
                                <Minus className="h-3.5 w-3.5" />
                              </button>
                              <span className="w-6 text-center text-sm font-700">{item.qty}</span>
                              <button
                                onClick={() => setQty(item.productId, item.qty + 1)}
                                className="flex h-8 w-8 items-center justify-center text-ink hover:bg-cream"
                                aria-label="Increase"
                              >
                                <Plus className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <footer className="border-t border-border bg-cream/30 p-4">
                  <div className="space-y-1.5 text-sm">
                    <div className="flex justify-between text-muted-foreground">
                      <span>Subtotal</span>
                      <span>₹{total}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Delivery</span>
                      <span>{deliveryFee === 0 ? <span className="text-leaf font-700">FREE</span> : `₹${deliveryFee}`}</span>
                    </div>
                    {total < 199 && (
                      <p className="text-[11px] text-muted-foreground">
                        Add ₹{199 - total} more for free delivery
                      </p>
                    )}
                    <div className="!mt-3 flex justify-between border-t border-border pt-3 font-display text-lg font-700 text-ink">
                      <span>Total</span>
                      <span>₹{grandTotal}</span>
                    </div>
                  </div>
                  <button
                    onClick={goCheckout}
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-terracotta py-3.5 text-sm font-700 text-terracotta-foreground transition-transform hover:scale-[1.01] active:scale-95"
                  >
                    Checkout <ArrowRight className="h-4 w-4" />
                  </button>
                </footer>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
