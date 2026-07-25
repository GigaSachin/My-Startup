import logoImg from "@/assets/milkkart-logo.jpeg";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <img
        src={logoImg}
        alt="Milkkart — Tested Pure. Delivered Fresh."
        className="h-10 w-10 rounded-full object-cover shadow-warm"
      />
      <span className="font-display text-2xl font-700 tracking-tight text-ink">
        Milk<span className="text-terracotta">kart</span>
      </span>
    </div>
  );
}
