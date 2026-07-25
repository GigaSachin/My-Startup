import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const reviews = [
  {
    name: "Priya Sharma",
    where: "Mom of 2, Gurgaon",
    text: "Finally a milk my kids' chai actually tastes of milk! And the free uple every month — my mother-in-law is convinced this is the best subscription I've ever taken.",
  },
  {
    name: "Anjali Verma",
    where: "Working Mom, Noida",
    text: "I've stopped boiling milk for 20 minutes out of fear. Milkkart is delivered in a glass bottle, ice-cold, before my alarm rings. Worth every rupee.",
  },
  {
    name: "Sunita Iyer",
    where: "Homemaker, Delhi",
    text: "The Misti Doi is exactly like Kolkata's. And the uple — I do my Hawan with peace of mind knowing it's clean and pure. Beautiful little touch.",
  },
];

export function Testimonials() {
  return (
    <section className="relative bg-background py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-2xl text-center"
        >
          <span className="inline-block rounded-full bg-terracotta/10 px-4 py-1.5 text-xs font-600 uppercase tracking-wider text-terracotta">
            Loved by Urban Mothers
          </span>
          <h2 className="mt-4 font-display text-4xl font-700 text-ink sm:text-5xl">
            4.9 ★ from <span className="text-terracotta">2,400+</span> homes
          </h2>
        </motion.div>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {reviews.map((r, i) => (
            <motion.div
              key={r.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="relative rounded-3xl border border-border bg-card p-6 shadow-card"
            >
              <Quote className="absolute right-5 top-5 h-8 w-8 text-terracotta/15" />
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <Star key={idx} className="h-4 w-4 fill-saffron text-saffron" />
                ))}
              </div>
              <p className="mt-4 text-sm leading-relaxed text-foreground">"{r.text}"</p>
              <div className="mt-5 flex items-center gap-3 border-t border-border pt-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-terracotta font-display text-base font-700 text-terracotta-foreground">
                  {r.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-700 text-ink">{r.name}</p>
                  <p className="text-xs text-muted-foreground">{r.where}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
