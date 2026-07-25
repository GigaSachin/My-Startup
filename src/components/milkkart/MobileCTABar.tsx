import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Sparkles } from "lucide-react";

export function MobileCTABar({
  onTrial,
  onWhatsApp,
}: {
  onTrial: () => void;
  onWhatsApp: () => void;
}) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 320);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 22, stiffness: 260 }}
          className="fixed inset-x-0 bottom-0 z-40 border-t border-border/60 bg-background/95 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 shadow-float backdrop-blur-xl md:hidden"
        >
          <div className="flex items-center gap-2">
            <button
              onClick={onTrial}
              className="group relative flex flex-1 items-center justify-center gap-1.5 overflow-hidden rounded-full bg-gradient-terracotta py-3.5 text-sm font-700 text-terracotta-foreground shadow-warm active:scale-[0.98]"
            >
              <Sparkles className="h-4 w-4" />
              Claim ₹1 Trial
            </button>
            <button
              onClick={onWhatsApp}
              aria-label="Order on WhatsApp"
              className="flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-full bg-whatsapp text-white shadow-soft active:scale-95"
            >
              <MessageCircle className="h-5 w-5" fill="currentColor" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
