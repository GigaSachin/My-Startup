import { motion } from "framer-motion";
import { Plus, Recycle, Loader2 } from "lucide-react";
import { useProducts } from "@/hooks/useProducts";
import { useCart } from "@/stores/cart";
import { toast } from "sonner";
import milkImg from "@/assets/product-milk.jpg";

export function ProductGrid() {
  const { data: products, isLoading } = useProducts();
  const add = useCart((s) => s.add);

  const handleAdd = (p: NonNullable<typeof products>[number]) => {
    add({
      productId: p.id,
      name: p.name,
      unit: p.unit,
      price: Number(p.price),
      imageUrl: p.image_url,
    });
    toast.success(`${p.name} added to cart`);
  };

  return (
    <section id="products" className="relative bg-background py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end"
        >
          <div className="max-w-xl">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-leaf/10 px-4 py-1.5 text-xs font-600 uppercase tracking-wider text-leaf">
              <Recycle className="h-3.5 w-3.5" /> Zero Wastage Catalog
            </span>
            <h2 className="mt-4 font-display text-4xl font-700 text-ink sm:text-5xl">
              From milk, with <span className="text-terracotta">love</span>.
            </h2>
            <p className="mt-3 text-base text-muted-foreground">
              What we don't deliver fresh, our village kitchens turn into Paneer, Dahi & sweets — by sundown.
            </p>
          </div>
        </motion.div>

        {isLoading ? (
          <div className="mt-16 flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-terracotta" />
          </div>
        ) : (
          <div className="mt-12 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
            {products?.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="group relative flex flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-card transition-all hover:-translate-y-1 hover:shadow-float"
              >
                <div className="relative aspect-square overflow-hidden bg-cream">
                  <img
                    src={p.image_url || milkImg}
                    alt={p.name}
                    width={768}
                    height={768}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {p.mrp && Number(p.mrp) > Number(p.price) && (
                    <span className="absolute left-3 top-3 rounded-full bg-background/95 px-2.5 py-1 text-[10px] font-700 uppercase tracking-wider text-terracotta shadow-soft backdrop-blur">
                      Save ₹{Number(p.mrp) - Number(p.price)}
                    </span>
                  )}
                </div>

                <div className="flex flex-1 flex-col p-4">
                  <h3 className="font-display text-base font-700 leading-tight text-ink sm:text-lg">{p.name}</h3>
                  <p className="mt-0.5 text-xs text-muted-foreground">{p.unit}</p>

                  <div className="mt-auto flex items-center justify-between pt-4">
                    <div className="flex items-baseline gap-1.5">
                      <p className="font-display text-xl font-700 text-ink">₹{Number(p.price)}</p>
                      {p.mrp && Number(p.mrp) > Number(p.price) && (
                        <p className="text-xs text-muted-foreground line-through">₹{Number(p.mrp)}</p>
                      )}
                    </div>
                    <button
                      onClick={() => handleAdd(p)}
                      aria-label={`Add ${p.name} to cart`}
                      className="flex h-10 items-center gap-1 rounded-full bg-terracotta px-3 text-xs font-700 text-terracotta-foreground shadow-soft transition-transform hover:scale-105 active:scale-95 sm:px-4"
                    >
                      <Plus className="h-4 w-4" />
                      <span className="hidden sm:inline">Add</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
