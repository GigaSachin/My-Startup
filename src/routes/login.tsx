import { useState } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Mail, Lock, Loader2, ArrowLeft, ShieldCheck, User as UserIcon } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { Logo } from "@/components/milkkart/Logo";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Login — Milkkart" },
      { name: "description", content: "Sign in to Milkkart to order pure, farm-fresh milk delivered to your door." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleGoogle = async () => {
    setGoogleLoading(true);
    try {
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: window.location.origin,
      });
      if (result.error) {
        toast.error("Google sign-in failed", { description: result.error.message });
        setGoogleLoading(false);
        return;
      }
      if (result.redirected) return; // browser navigates away
      toast.success("Welcome to Milkkart!");
      navigate({ to: "/account" });
    } catch (e) {
      toast.error("Google sign-in failed", { description: e instanceof Error ? e.message : String(e) });
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || password.length < 6) {
      toast.error("Enter a valid email and a password (min 6 chars)");
      return;
    }
    setLoading(true);
    if (mode === "signup") {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: window.location.origin,
          data: { full_name: name || undefined },
        },
      });
      setLoading(false);
      if (error) {
        toast.error("Signup failed", { description: error.message });
        return;
      }
      toast.success("Account created! Check your email to confirm (if required).");
      navigate({ to: "/account" });
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      setLoading(false);
      if (error) {
        toast.error("Login failed", { description: error.message });
        return;
      }
      toast.success("Welcome back!");
      navigate({ to: "/account" });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-hero px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Link
          to="/"
          className="mb-6 inline-flex items-center gap-1 text-sm font-600 text-muted-foreground hover:text-ink"
        >
          <ArrowLeft className="h-4 w-4" /> Back home
        </Link>

        <div className="rounded-3xl border border-border bg-background p-7 shadow-float">
          <div className="flex justify-center"><Logo /></div>

          <h1 className="mt-6 text-center font-display text-2xl font-700 text-ink">
            {mode === "signin" ? "Welcome back" : "Create your account"}
          </h1>
          <p className="mt-1 text-center text-sm text-muted-foreground">
            {mode === "signin"
              ? "Sign in to order fresh milk"
              : "Join Milkkart in seconds"}
          </p>

          {/* Google */}
          <button
            type="button"
            onClick={handleGoogle}
            disabled={googleLoading}
            className="mt-6 flex w-full items-center justify-center gap-2.5 rounded-xl border-2 border-border bg-background py-3 text-sm font-700 text-ink transition-all hover:bg-cream disabled:opacity-50"
          >
            {googleLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <GoogleIcon />
                Continue with Google
              </>
            )}
          </button>

          <div className="my-5 flex items-center gap-3 text-[11px] font-700 uppercase tracking-wider text-muted-foreground">
            <div className="h-px flex-1 bg-border" />
            or
            <div className="h-px flex-1 bg-border" />
          </div>

          <form onSubmit={handleEmail} className="space-y-3">
            {mode === "signup" && (
              <Field icon={<UserIcon className="h-4 w-4 text-terracotta" />}>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Full name"
                  className="w-full bg-transparent text-sm font-500 outline-none"
                />
              </Field>
            )}
            <Field icon={<Mail className="h-4 w-4 text-terracotta" />}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                required
                className="w-full bg-transparent text-sm font-500 outline-none"
              />
            </Field>
            <Field icon={<Lock className="h-4 w-4 text-terracotta" />}>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password (min 6 chars)"
                autoComplete={mode === "signin" ? "current-password" : "new-password"}
                required
                minLength={6}
                className="w-full bg-transparent text-sm font-500 outline-none"
              />
            </Field>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-terracotta py-3.5 text-sm font-700 text-terracotta-foreground transition-transform hover:scale-[1.01] active:scale-95 disabled:opacity-50"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : mode === "signin" ? "Sign in" : "Create account"}
            </button>
          </form>

          <p className="mt-5 text-center text-xs text-muted-foreground">
            {mode === "signin" ? "New to Milkkart?" : "Already have an account?"}{" "}
            <button
              type="button"
              onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
              className="font-700 text-terracotta hover:underline"
            >
              {mode === "signin" ? "Create account" : "Sign in"}
            </button>
          </p>

          <p className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground">
            <ShieldCheck className="h-3.5 w-3.5" /> Secure login
          </p>
        </div>
      </motion.div>
    </div>
  );
}

function Field({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 rounded-xl border-2 border-border bg-cream px-3 py-3 focus-within:border-terracotta">
      {icon}
      {children}
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.6-6 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.3-.4-3.5z"/>
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 15.1 18.9 12 24 12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/>
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 34.9 26.7 36 24 36c-5.3 0-9.7-3.4-11.3-8l-6.5 5C9.6 39.6 16.3 44 24 44z"/>
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.3-4.1 5.6l6.2 5.2C41.4 35.3 44 30 44 24c0-1.3-.1-2.3-.4-3.5z"/>
    </svg>
  );
}
