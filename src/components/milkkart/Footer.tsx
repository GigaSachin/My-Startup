import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Instagram, Facebook, Mail, MessageCircle } from "lucide-react";
import { Logo } from "./Logo";

const faqs = [
  {
    q: "What if my milk is spoiled or arrives late?",
    a: "Zero questions asked. Report it on WhatsApp within 2 hours and we instantly refund the amount back to your wallet — plus add a free 500ml as apology.",
  },
  {
    q: "What time will my milk arrive?",
    a: "Every order is delivered between 5:30 AM and 7:00 AM. You'll get a WhatsApp ping with your delivery partner's live location.",
  },
  {
    q: "Can I pause or cancel my subscription?",
    a: "Anytime. Pause for a day, a week, or a month — directly from WhatsApp. Unused wallet balance is 100% refundable to your bank account.",
  },
  {
    q: "Is the milk pasteurised or raw?",
    a: "We deliver both. Raw milk (boil before use) is the most popular for chai & paneer. Pasteurised toned milk is also available for instant use.",
  },
  {
    q: "Which areas do you deliver to?",
    a: "Currently serving Delhi NCR — Gurgaon, Noida, Greater Noida, Faridabad. Bangalore & Mumbai launching soon.",
  },
];

export function Footer({ onWhatsApp }: { onWhatsApp: () => void }) {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <footer className="bg-cream pt-20 pb-8">
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        {/* FAQ */}
        <div className="mx-auto max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <span className="inline-block rounded-full bg-ink/10 px-4 py-1.5 text-xs font-600 uppercase tracking-wider text-ink">
              FAQ
            </span>
            <h2 className="mt-4 font-display text-3xl font-700 text-ink sm:text-4xl">
              Doubts? We've got answers.
            </h2>
          </motion.div>

          <div className="mt-10 space-y-3">
            {faqs.map((f, i) => {
              const open = openIdx === i;
              return (
                <div
                  key={f.q}
                  className="overflow-hidden rounded-2xl border border-border bg-background shadow-card"
                >
                  <button
                    onClick={() => setOpenIdx(open ? null : i)}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                  >
                    <span className="text-sm font-600 text-ink sm:text-base">{f.q}</span>
                    <Plus
                      className={`h-5 w-5 shrink-0 text-terracotta transition-transform ${open ? "rotate-45" : ""}`}
                    />
                  </button>
                  <AnimatePresence initial={false}>
                    {open && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                      >
                        <p className="px-5 pb-5 text-sm leading-relaxed text-muted-foreground">{f.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer body */}
        <div className="mt-20 grid gap-10 border-t border-border pt-12 md:grid-cols-4">
          <div className="md:col-span-2">
            <Logo />
            <p className="mt-4 max-w-sm text-sm text-muted-foreground">
              A rural-to-urban dairy revolution. Tested pure. Delivered fresh. Paying farmers what they truly deserve.
            </p>
            <button
              onClick={onWhatsApp}
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-whatsapp px-5 py-3 text-sm font-700 text-white shadow-soft"
            >
              <MessageCircle className="h-4 w-4" fill="currentColor" />
              Order on WhatsApp
            </button>
          </div>

          <div>
            <h4 className="font-display text-sm font-700 uppercase tracking-wider text-ink">Company</h4>
            <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
              <li><a href="#story" className="hover:text-terracotta">Our Story</a></li>
              <li><a href="#products" className="hover:text-terracotta">Products</a></li>
              <li><a href="#partner" className="hover:text-terracotta">For Farmers</a></li>
              <li><a href="#wallet" className="hover:text-terracotta">Wallet</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display text-sm font-700 uppercase tracking-wider text-ink">Legal</h4>
            <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-terracotta">Refund Policy</a></li>
              <li><a href="#" className="hover:text-terracotta">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-terracotta">Terms of Service</a></li>
              <li><a href="#" className="hover:text-terracotta">Contact</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Milkkart Dairy Pvt. Ltd. — Made with ❤️ in Bharat.
          </p>
          <div className="flex gap-2">
            <a
              href="https://www.instagram.com/the_milkkart"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-background text-muted-foreground shadow-soft transition-colors hover:bg-terracotta hover:text-terracotta-foreground"
            >
              <Instagram className="h-4 w-4" />
            </a>
            <a
              href="https://www.facebook.com/profile.php?id=61572127574063"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-background text-muted-foreground shadow-soft transition-colors hover:bg-terracotta hover:text-terracotta-foreground"
            >
              <Facebook className="h-4 w-4" />
            </a>
            <a
              href="https://wa.me/917061884584"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-background text-muted-foreground shadow-soft transition-colors hover:bg-whatsapp hover:text-white"
            >
              <MessageCircle className="h-4 w-4" />
            </a>
            <a
              href="mailto:themilkkart.in@gmail.com"
              aria-label="Email"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-background text-muted-foreground shadow-soft transition-colors hover:bg-terracotta hover:text-terracotta-foreground"
            >
              <Mail className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
