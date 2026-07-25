import { motion } from "framer-motion";
import { Wallet, Pause, Repeat, Flame, Flower2 } from "lucide-react";
import upleImg from "@/assets/uple.jpg";

export function WalletPerk({ onTrial }: { onTrial: () => void }) {
  return (
    <section id="wallet" className="relative bg-cream py-20 sm:py-28">
      <div className="texture-paper absolute inset-0 opacity-50" />
      <div className="relative mx-auto max-w-6xl px-5 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-2xl text-center"
        >
          <span className="inline-block rounded-full bg-terracotta/10 px-4 py-1.5 text-xs font-600 uppercase tracking-wider text-terracotta">
            Subscription Wallet
          </span>
          <h2 className="mt-4 font-display text-4xl font-700 text-ink sm:text-5xl">
            Recharge once. Sip fresh, <span className="text-terracotta">every day.</span>
          </h2>
          <p className="mt-4 text-base text-muted-foreground sm:text-lg">
            Add money to your Milkkart Wallet — we auto-deduct only for what you order. Pause, skip or top-up anytime.
          </p>
        </motion.div>

        <div className="mt-14 grid gap-6 lg:grid-cols-5">
          {/* Wallet card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2"
          >
            <div className="relative h-full overflow-hidden rounded-3xl bg-gradient-to-br from-ink to-ink/80 p-7 text-background shadow-float">
              <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-terracotta/30 blur-2xl" />
              <div className="relative">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-background/10 backdrop-blur">
                    <Wallet className="h-5 w-5" />
                  </div>
                  <span className="text-sm font-500 opacity-80">Milkkart Wallet</span>
                </div>

                <p className="mt-8 text-xs uppercase tracking-wider opacity-60">Top-up balance</p>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="font-display text-5xl font-700">₹1000</span>
                  <span className="text-sm opacity-70">≈ 16 days of milk</span>
                </div>

                <div className="mt-7 grid grid-cols-3 gap-3 text-center">
                  <div className="rounded-xl bg-background/10 p-3 backdrop-blur">
                    <Repeat className="mx-auto h-4 w-4" />
                    <p className="mt-1 text-[10px] font-500">Auto-deduct</p>
                  </div>
                  <div className="rounded-xl bg-background/10 p-3 backdrop-blur">
                    <Pause className="mx-auto h-4 w-4" />
                    <p className="mt-1 text-[10px] font-500">Pause anytime</p>
                  </div>
                  <div className="rounded-xl bg-background/10 p-3 backdrop-blur">
                    <Wallet className="mx-auto h-4 w-4" />
                    <p className="mt-1 text-[10px] font-500">100% refund</p>
                  </div>
                </div>

                <button
                  onClick={onTrial}
                  className="mt-7 w-full rounded-full bg-background px-6 py-3.5 text-sm font-700 text-ink transition-transform hover:scale-[1.02] active:scale-95"
                >
                  Recharge & Start Trial
                </button>
              </div>
            </div>
          </motion.div>

          {/* Desi Perk card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-3"
          >
            <div className="relative h-full overflow-hidden rounded-3xl border-2 border-clay/30 bg-gradient-puja p-7 shadow-warm sm:p-9">
              {/* decorative marigold motif */}
              <div className="absolute -right-8 -top-8 opacity-30">
                <Flower2 className="h-44 w-44 text-background" />
              </div>
              <div className="absolute bottom-4 left-4 opacity-20">
                <Flower2 className="h-20 w-20 text-background" />
              </div>

              <div className="relative grid gap-6 sm:grid-cols-5 sm:items-center">
                <div className="sm:col-span-3">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-background/90 px-3 py-1 text-[11px] font-700 uppercase tracking-wider text-terracotta">
                    <Flame className="h-3 w-3" /> The Desi Perk
                  </span>
                  <h3 className="mt-4 font-display text-3xl font-700 leading-tight text-background sm:text-[2.25rem]">
                    Subscribe Monthly. Get <span className="underline decoration-background/40 decoration-wavy underline-offset-4">10 Free Uple</span> for your daily Puja.
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-background/90 sm:text-base">
                    Pure, sun-dried cow dung cakes — handmade in our partner villages — delivered with your monthly subscription. Perfect for your morning Hawan and evening Aarti.
                  </p>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {["Sun-dried", "Handmade", "Puja-grade", "Free with monthly plan"].map((b) => (
                      <span
                        key={b}
                        className="rounded-full bg-background/20 px-3 py-1 text-xs font-500 text-background backdrop-blur"
                      >
                        {b}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <div className="overflow-hidden rounded-2xl border-4 border-background/30 shadow-float">
                    <img
                      src={upleImg}
                      alt="Stack of traditional Indian uple cow dung cakes for puja"
                      width={1024}
                      height={768}
                      loading="lazy"
                      className="h-48 w-full object-cover sm:h-56"
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
