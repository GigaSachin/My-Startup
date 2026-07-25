import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ShoppingBag, User } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Logo } from "./Logo";
import { useCart } from "@/stores/cart";
import { useAuth } from "@/contexts/AuthContext";

const links = [
  { label: "Our Story", href: "#story" },
  { label: "Products", href: "#products" },
  { label: "Wallet", href: "#wallet" },
  { label: "Partner", href: "#partner" },
];

export function Navbar({ onCartOpen }: { onCartOpen: () => void }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const totalQty = useCart((s) => s.totalQty());
  const { user } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-6 sm:pt-4"
    >
      <nav
        className={`mx-auto flex max-w-6xl items-center justify-between rounded-full border border-border/60 px-4 py-2.5 backdrop-blur-xl transition-all sm:px-6 ${
          scrolled ? "bg-background/85 shadow-float" : "bg-background/60 shadow-soft"
        }`}
      >
        <Logo />

        <div className="hidden items-center gap-7 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm font-500 text-muted-foreground transition-colors hover:text-terracotta"
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Link
            to={user ? "/account" : "/login"}
            aria-label={user ? "My account" : "Login"}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-cream text-ink hover:bg-cream/80"
          >
            <User className="h-4 w-4" />
          </Link>
          <button
            onClick={onCartOpen}
            aria-label="Open cart"
            className="relative flex h-10 items-center gap-1.5 rounded-full bg-terracotta px-4 text-sm font-700 text-terracotta-foreground shadow-soft transition-transform hover:scale-105 active:scale-95"
          >
            <ShoppingBag className="h-4 w-4" />
            <span className="hidden sm:inline">Cart</span>
            {totalQty > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-ink px-1 text-[10px] font-700 text-background">
                {totalQty}
              </span>
            )}
          </button>
          <button
            onClick={() => setOpen((o) => !o)}
            aria-label="Menu"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-cream text-ink md:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mx-auto mt-2 max-w-6xl rounded-3xl border border-border/60 bg-background/95 p-4 shadow-float backdrop-blur-xl md:hidden"
          >
            <div className="flex flex-col gap-1">
              {links.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="rounded-xl px-4 py-3 text-base font-500 text-foreground hover:bg-cream"
                >
                  {l.label}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
