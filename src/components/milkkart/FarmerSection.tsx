import { motion } from "framer-motion";
import { IndianRupee, Banknote, BadgeCheck, ArrowRight } from "lucide-react";
import farmerImg from "@/assets/farmer.jpg";

const props = [
  { icon: BadgeCheck, title: "Transparent Pricing", desc: "Lactometer reading shown on the spot. You see what you earn." },
  { icon: Banknote, title: "Daily / Weekly Payouts", desc: "Direct UPI & bank transfer. No paperwork, no waiting." },
  { icon: IndianRupee, title: "Bonus on Purity", desc: "Higher SNF & fat? Earn 15-25% more than the local mandi rate." },
];

export function FarmerSection({ onJoin }: { onJoin: () => void }) {
  return (
    <section id="partner" className="relative overflow-hidden bg-ink py-20 text-background sm:py-28">
      <div className="absolute inset-0 opacity-[0.04]"
           style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "20px 20px" }}
      />
      <div className="absolute -left-32 top-1/2 h-80 w-80 -translate-y-1/2 rounded-full bg-terracotta/20 blur-3xl" />

      <div className="relative mx-auto grid max-w-6xl gap-10 px-5 sm:px-6 lg:grid-cols-2 lg:items-center lg:gap-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative order-last lg:order-first"
        >
          <div className="overflow-hidden rounded-[2rem] border-4 border-background/10 shadow-float">
            <img
              src={farmerImg}
              alt="Smiling Indian farmer with his cow at sunrise"
              width={1280}
              height={960}
              loading="lazy"
              className="h-[380px] w-full object-cover sm:h-[480px]"
            />
          </div>
          <div className="absolute -right-2 bottom-6 rounded-2xl bg-background p-4 text-ink shadow-float sm:-right-6">
            <p className="text-[10px] font-600 uppercase tracking-wider text-muted-foreground">This month</p>
            <p className="font-display text-2xl font-700 text-leaf">+₹4,820</p>
            <p className="text-[11px] text-muted-foreground">extra paid to Ramesh ji</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <span className="inline-block rounded-full bg-saffron/20 px-4 py-1.5 text-xs font-600 uppercase tracking-wider text-saffron">
            For our Milkmen
          </span>
          <h2 className="mt-4 font-display text-4xl font-700 leading-tight sm:text-5xl">
            Get the <span className="text-saffron">best price</span> for your pure milk.
          </h2>
          <p className="mt-4 text-base text-background/75 sm:text-lg">
            No more fixed-rate exploitation. Bring your milk to our village collection point — we test it, value it, and pay you what it truly deserves.
          </p>

          <div className="mt-8 space-y-3">
            {props.map((p) => (
              <div key={p.title} className="flex gap-4 rounded-2xl bg-background/5 p-4 backdrop-blur">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-saffron/15 text-saffron">
                  <p.icon className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-display text-base font-700">{p.title}</h4>
                  <p className="mt-0.5 text-sm text-background/70">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={onJoin}
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-saffron px-7 py-4 text-sm font-700 text-ink shadow-warm transition-transform hover:scale-105 active:scale-95 sm:text-base"
          >
            Join as Supplier
            <ArrowRight className="h-4 w-4" />
          </button>
        </motion.div>
      </div>
    </section>
  );
}
