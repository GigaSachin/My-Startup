import { motion } from "framer-motion";
import { Tractor, FlaskConical, Snowflake, Truck } from "lucide-react";

const steps = [
  {
    icon: Tractor,
    title: "Sourced Direct",
    desc: "From small village dairies in Bihar & UP — no middlemen, no markups.",
    accent: "leaf",
  },
  {
    icon: FlaskConical,
    title: "Lactometer Tested",
    desc: "Every batch checked for purity, fat content & SNF before it leaves the village.",
    accent: "terracotta",
  },
  {
    icon: Snowflake,
    title: "Cold Chain at 4°C",
    desc: "Insulated transport keeps every drop farm-fresh till it reaches your door.",
    accent: "ink",
  },
  {
    icon: Truck,
    title: "Delivered by 7 AM",
    desc: "Wake up to fresh milk. Every single morning, rain or shine.",
    accent: "clay",
  },
];

const accentMap: Record<string, string> = {
  leaf: "bg-leaf/10 text-leaf",
  terracotta: "bg-terracotta/10 text-terracotta",
  ink: "bg-ink/10 text-ink",
  clay: "bg-clay/15 text-clay",
};

export function Promise() {
  return (
    <section id="story" className="relative bg-background py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-2xl text-center"
        >
          <span className="inline-block rounded-full bg-leaf/10 px-4 py-1.5 text-xs font-600 uppercase tracking-wider text-leaf">
            The Milkkart Promise
          </span>
          <h2 className="mt-4 font-display text-4xl font-700 text-ink sm:text-5xl">
            From the udder to your <span className="text-terracotta">doorstep</span> — in 12 hours.
          </h2>
          <p className="mt-4 text-base text-muted-foreground sm:text-lg">
            Four ruthless steps. Zero compromise. This is how we earn your morning.
          </p>
        </motion.div>

        <div className="relative mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {/* connecting line on desktop */}
          <div className="absolute left-0 right-0 top-12 hidden h-px bg-gradient-to-r from-transparent via-border to-transparent lg:block" />

          {steps.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="relative"
            >
              <div className="group relative h-full rounded-3xl border border-border bg-card p-6 shadow-card transition-all hover:-translate-y-1 hover:shadow-float">
                <div className="absolute -top-3 left-6 rounded-full bg-ink px-3 py-1 text-[10px] font-700 uppercase tracking-wider text-background">
                  Step {i + 1}
                </div>
                <div
                  className={`mt-2 mb-4 flex h-14 w-14 items-center justify-center rounded-2xl ${accentMap[s.accent]} transition-transform group-hover:scale-110`}
                >
                  <s.icon className="h-7 w-7" strokeWidth={2} />
                </div>
                <h3 className="font-display text-xl font-700 text-ink">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
