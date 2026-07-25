import { motion } from "framer-motion";
import { MessageCircle, Sparkles, Clock, ShieldCheck } from "lucide-react";
import heroImg from "@/assets/hero-milk.jpg";
import { PincodeCheck } from "./PincodeCheck";

export function Hero({
  onTrial,
  onWhatsApp,
}: {
  onTrial: () => void;
  onWhatsApp: () => void;
}) {
  return (
    <section className="relative overflow-hidden bg-gradient-hero pt-28 pb-12 sm:pt-36 sm:pb-20">
      <div className="texture-paper absolute inset-0 opacity-60" />
      <div className="absolute -right-32 top-20 h-80 w-80 rounded-full bg-saffron/20 blur-3xl" />
      <div className="absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-leaf/15 blur-3xl" />

      <div className="relative mx-auto grid max-w-6xl gap-10 px-5 sm:px-6 lg:grid-cols-2 lg:items-center lg:gap-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center lg:text-left"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 rounded-full border border-terracotta/20 bg-cream px-4 py-1.5 text-xs font-600 text-terracotta shadow-soft"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Tested Pure. Delivered Fresh.
          </motion.span>

          <h1 className="mt-5 font-display text-[2.5rem] font-700 leading-[1.05] text-ink sm:text-5xl lg:text-[3.75rem]">
            100% Tested Pure Milk,{" "}
            <span className="relative inline-block text-terracotta">
              Farm to Glass
              <svg
                viewBox="0 0 200 12"
                className="absolute -bottom-2 left-0 h-2.5 w-full text-clay"
                preserveAspectRatio="none"
              >
                <path
                  d="M2 8 Q50 2 100 6 T198 5"
                  stroke="currentColor"
                  strokeWidth="3"
                  fill="none"
                  strokeLinecap="round"
                />
              </svg>
            </span>
            .
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-base text-muted-foreground sm:text-lg lg:mx-0">
            Sourced from village dairies, lactometer-tested for purity, cold-chain delivered
            to your doorstep — <span className="font-600 text-foreground">every morning before 7 AM.</span>
          </p>

          <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center lg:justify-start">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={onTrial}
              className="group relative overflow-hidden rounded-full bg-gradient-terracotta px-6 py-4 text-sm font-700 text-terracotta-foreground shadow-warm sm:text-base"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                Claim 500ml Free Trial
                <span className="rounded-full bg-cream/25 px-2 py-0.5 text-xs">Pay ₹1</span>
              </span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={onWhatsApp}
              className="flex items-center justify-center gap-2 rounded-full border-2 border-whatsapp bg-background px-6 py-3.5 text-sm font-600 text-whatsapp transition-colors hover:bg-whatsapp hover:text-white sm:text-base"
            >
              <MessageCircle className="h-5 w-5" fill="currentColor" />
              Chat on WhatsApp
            </motion.button>
          </div>

          <PincodeCheck />

          <div className="mt-8 grid grid-cols-3 gap-3 text-left lg:max-w-md">
            {[
              { icon: ShieldCheck, label: "100% Tested" },
              { icon: Clock, label: "Before 7 AM" },
              { icon: Sparkles, label: "Zero Adulteration" },
            ].map((f, i) => (
              <motion.div
                key={f.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                className="flex flex-col items-center gap-1.5 rounded-2xl bg-background/60 p-3 text-center shadow-card backdrop-blur sm:flex-row sm:text-left"
              >
                <f.icon className="h-5 w-5 shrink-0 text-leaf" />
                <span className="text-xs font-600 text-foreground sm:text-sm">{f.label}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.2 }}
          className="relative mx-auto w-full max-w-md lg:max-w-none"
        >
          <div className="relative overflow-hidden rounded-[2rem] shadow-float ring-1 ring-border/40">
            <img
              src={heroImg}
              alt="Glass bottle of farm-fresh milk on a wooden table at sunrise"
              width={1280}
              height={1280}
              className="h-[420px] w-full object-cover sm:h-[520px]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/30 via-transparent to-transparent" />
          </div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 }}
            className="absolute -left-3 top-8 rounded-2xl border border-border/50 bg-background/95 p-3 shadow-float backdrop-blur sm:-left-6"
          >
            <div className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-leaf/10">
                <ShieldCheck className="h-5 w-5 text-leaf" />
              </div>
              <div>
                <p className="text-[10px] font-500 uppercase tracking-wider text-muted-foreground">Lactometer</p>
                <p className="text-sm font-700 text-ink">Reading 28.5</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1 }}
            className="absolute -right-2 bottom-10 rounded-2xl border border-border/50 bg-background/95 p-3 shadow-float backdrop-blur sm:-right-4"
          >
            <p className="text-[10px] font-500 uppercase tracking-wider text-muted-foreground">Delivered by</p>
            <p className="text-lg font-700 text-terracotta">6:48 AM</p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
