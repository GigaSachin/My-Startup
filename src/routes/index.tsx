import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Navbar } from "@/components/milkkart/Navbar";
import { Hero } from "@/components/milkkart/Hero";
import { Promise as MilkPromise } from "@/components/milkkart/Promise";
import { WalletPerk } from "@/components/milkkart/WalletPerk";
import { ProductGrid } from "@/components/milkkart/ProductGrid";
import { FarmerSection } from "@/components/milkkart/FarmerSection";
import { Testimonials } from "@/components/milkkart/Testimonials";
import { Footer } from "@/components/milkkart/Footer";
import { CartDrawer } from "@/components/milkkart/CartDrawer";
import { FloatingWhatsApp } from "@/components/milkkart/FloatingWhatsApp";
import { MobileCTABar } from "@/components/milkkart/MobileCTABar";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Milkkart — Tested Pure. Delivered Fresh. Farm Milk Before 7 AM" },
      {
        name: "description",
        content:
          "100% lactometer-tested pure milk delivered cold-chain to your doorstep before 7 AM. Order fresh milk, paneer, dahi & sweets online.",
      },
      { property: "og:title", content: "Milkkart — Tested Pure. Delivered Fresh." },
      {
        property: "og:description",
        content: "Farm-direct milk, lactometer-tested, delivered before 7 AM.",
      },
    ],
  }),
  component: Index,
});

const WHATSAPP_URL =
  "https://wa.me/917061884584?text=Hi%20Milkkart!%20I%27d%20like%20to%20order%20fresh%20milk.";

function Index() {
  const [cartOpen, setCartOpen] = useState(false);
  const navigate = useNavigate();

  const openWhatsApp = () => window.open(WHATSAPP_URL, "_blank");
  const goCheckout = () => navigate({ to: "/checkout" });

  return (
    <div className="min-h-screen bg-background">
      <Navbar onCartOpen={() => setCartOpen(true)} />
      <main>
        <Hero onTrial={goCheckout} onWhatsApp={openWhatsApp} />
        <MilkPromise />
        <ProductGrid />
        <WalletPerk onTrial={goCheckout} />
        <FarmerSection onJoin={openWhatsApp} />
        <Testimonials />
      </main>
      <Footer onWhatsApp={openWhatsApp} />
      <FloatingWhatsApp onClick={openWhatsApp} />
      <MobileCTABar onTrial={goCheckout} onWhatsApp={openWhatsApp} />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
}
