import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, CheckCircle2, Bell, Loader2 } from "lucide-react";

const SERVICEABLE = ["110001", "110020", "122001", "122002", "122018", "201301", "201310", "121001"];

type Status = "idle" | "checking" | "available" | "waitlist";

export function PincodeCheck() {
  const [pin, setPin] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [email, setEmail] = useState("");
  const [joined, setJoined] = useState(false);

  const handleCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.length !== 6) return;
    setStatus("checking");
    setTimeout(() => {
      setStatus(SERVICEABLE.includes(pin) ? "available" : "waitlist");
    }, 700);
  };

  const reset = () => {
    setStatus("idle");
    setPin("");
    setEmail("");
    setJoined(false);
  };

  return (
    <div className="mt-6 rounded-2xl border border-border/60 bg-background/80 p-3 shadow-soft backdrop-blur lg:max-w-md">
      <AnimatePresence mode="wait">
        {status === "idle" || status === "checking" ? (
          <motion.form
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onSubmit={handleCheck}
            className="flex items-center gap-2"
          >
            <div className="flex flex-1 items-center gap-2 rounded-xl bg-cream px-3 py-2.5">
              <MapPin className="h-4 w-4 shrink-0 text-terracotta" />
              <input
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
                placeholder="Enter your pincode"
                className="w-full bg-transparent text-sm font-600 text-ink outline-none placeholder:font-500 placeholder:text-muted-foreground"
              />
            </div>
            <button
              type="submit"
              disabled={pin.length !== 6 || status === "checking"}
              className="flex items-center justify-center rounded-xl bg-ink px-4 py-2.5 text-sm font-700 text-background transition-opacity disabled:opacity-40"
            >
              {status === "checking" ? <Loader2 className="h-4 w-4 animate-spin" /> : "Check"}
            </button>
          </motion.form>
        ) : status === "available" ? (
          <motion.div
            key="ok"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-3 px-1 py-1"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-leaf/15">
              <CheckCircle2 className="h-5 w-5 text-leaf" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-700 text-ink">Yes! We deliver to {pin} 🎉</p>
              <p className="text-[11px] text-muted-foreground">Tomorrow morning, before 7 AM.</p>
            </div>
            <button onClick={reset} className="text-xs font-600 text-terracotta">
              Change
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="wait"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            {!joined ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (email) setJoined(true);
                }}
                className="flex items-center gap-2"
              >
                <div className="flex flex-1 items-center gap-2 rounded-xl bg-saffron/15 px-3 py-2.5">
                  <Bell className="h-4 w-4 shrink-0 text-saffron" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={`Not in ${pin} yet — get notified`}
                    className="w-full bg-transparent text-sm font-500 text-ink outline-none placeholder:text-muted-foreground"
                  />
                </div>
                <button
                  type="submit"
                  className="rounded-xl bg-saffron px-4 py-2.5 text-sm font-700 text-ink"
                >
                  Notify
                </button>
              </form>
            ) : (
              <div className="flex items-center gap-3 px-1 py-1">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-saffron/20">
                  <CheckCircle2 className="h-5 w-5 text-saffron" />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm font-700 text-ink">You're on the waitlist!</p>
                  <p className="text-[11px] text-muted-foreground">We'll email you the moment we launch in {pin}.</p>
                </div>
                <button onClick={reset} className="text-xs font-600 text-terracotta">
                  Reset
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
