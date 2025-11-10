// src/pages/Signup.tsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../components/ui/use-toast";
import SpotlightCard from "../components/aceternity/SpotlightCard";
import RippleButton from "../components/aceternity/RippleButton";
import SparklesText from "../components/aceternity/SparklesText";

export default function Signup() {
  const { signUp } = useAuth();
  const { toast } = useToast();
  const nav = useNavigate();

  const [form, setForm] = useState({ email: "", username: "", password: "" });
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);

    try {
      await signUp(form.email, form.password, form.username);
      toast({
        title: "Check your inbox",
        description: "We emailed a verification link.",
      });
      nav("/email-verification", { replace: true });
    } catch (err: any) {
      toast({
        title: "Signup failed",
        description: err?.message || "Please try again.",
        variant: "destructive",
      });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
      <SpotlightCard className="w-full max-w-md">
        <h1 className="text-2xl font-semibold">
          <SparklesText>Create account</SparklesText>
        </h1>

        <form onSubmit={submit} className="mt-5 grid gap-4">
          {/* EMAIL */}
          <div>
            <label className="text-sm text-gray-300">Email</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="mt-1 w-full rounded-xl bg-black/40 border border-zinc-800 px-3 py-2"
            />
          </div>

          {/* USERNAME */}
          <div>
            <label className="text-sm text-gray-300">Username</label>
            <input
              required
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              className="mt-1 w-full rounded-xl bg-black/40 border border-zinc-800 px-3 py-2"
            />
          </div>

          {/* PASSWORD */}
          <div>
            <label className="text-sm text-gray-300">Password</label>
            <input
              type="password"
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="mt-1 w-full rounded-xl bg-black/40 border border-zinc-800 px-3 py-2"
            />
          </div>

          <RippleButton
            disabled={busy}
            className="mt-2 w-full rounded-xl bg-white text-black font-semibold py-2 disabled:opacity-60"
          >
            {busy ? "Creating…" : "Sign up"}
          </RippleButton>

          <div className="text-sm text-gray-400">
            Have an account? <Link to="/login" className="underline">
            Log in
            </Link>
          </div>
        </form>
      </SpotlightCard>
    </div>
  );
}
