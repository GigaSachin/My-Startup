import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";

export function FloatingWhatsApp({ onClick }: { onClick: () => void }) {
  return (
    <motion.button
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1.5, type: "spring", stiffness: 200 }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.92 }}
      onClick={onClick}
      aria-label="Chat on WhatsApp"
      className="fixed bottom-24 right-5 z-30 hidden h-14 w-14 items-center justify-center rounded-full bg-whatsapp text-white shadow-warm sm:bottom-6 sm:right-6 md:flex"
    >
      <span className="absolute inset-0 animate-ping rounded-full bg-whatsapp opacity-30" />
      <MessageCircle className="relative h-6 w-6" fill="currentColor" />
    </motion.button>
  );
}
