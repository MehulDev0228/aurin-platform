// src/pages/Signup.tsx
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../components/ui/use-toast";
import { signupSchema, type SignupFormData } from "../lib/validations";
import { sanitizeEmail, sanitizeString } from "../lib/sanitize";
import { checkUsernameAvailability } from "../lib/usernameCheck";
import { logger } from "../lib/logger";
import SpotlightCard from "../components/aceternity/SpotlightCard";
import RippleButton from "../components/aceternity/RippleButton";
import SparklesText from "../components/aceternity/SparklesText";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";

export default function Signup() {
  const { signUp } = useAuth();
  const { toast } = useToast();
  const nav = useNavigate();
  const [busy, setBusy] = useState(false);
  const [usernameStatus, setUsernameStatus] = useState<{ checking: boolean; available: boolean | null; message?: string }>({ checking: false, available: null });

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const username = watch('username');

  // Check username availability in real-time
  useEffect(() => {
    const checkUsername = async () => {
      if (!username || username.length < 3) {
        setUsernameStatus({ checking: false, available: null });
        return;
      }

      setUsernameStatus({ checking: true, available: null });
      const result = await checkUsernameAvailability(username.toLowerCase());
      setUsernameStatus({ 
        checking: false, 
        available: result.available,
        message: result.message 
      });
    };

    const timeoutId = setTimeout(checkUsername, 500); // Debounce
    return () => clearTimeout(timeoutId);
  }, [username]);

  const submit = async (data: SignupFormData) => {
    // Check username availability one more time before submitting
    const usernameCheck = await checkUsernameAvailability(data.username.toLowerCase());
    if (!usernameCheck.available) {
      toast({
        title: "Username unavailable",
        description: usernameCheck.message || "This username is already taken",
        variant: "destructive",
      });
      return;
    }

    setBusy(true);
    try {
      const sanitizedEmail = sanitizeEmail(data.email);
      const sanitizedUsername = sanitizeString(data.username.toLowerCase());
      
      await signUp(sanitizedEmail, data.password, sanitizedUsername);
      toast({
        title: "Account created!",
        description: "Welcome to AURIN. Setting up your profile...",
      });
      nav("/onboarding", { replace: true });
    } catch (err: any) {
      logger.error('Signup failed', { error: err, context: 'Signup' });
      toast({
        title: "Signup failed",
        description: err?.message || "Unable to create your account. Please check your information and try again.",
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

        <form onSubmit={handleSubmit(submit)} className="mt-5 grid gap-4">
          {/* EMAIL */}
          <div>
            <label className="text-sm text-gray-300">Email</label>
            <input
              type="email"
              {...register("email")}
              className={`mt-1 w-full rounded-xl bg-black/40 border px-3 py-2 ${
                errors.email ? 'border-red-500' : 'border-zinc-800'
              }`}
            />
            {errors.email && (
              <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* USERNAME */}
          <div>
            <label className="text-sm text-gray-300">Username</label>
            <div className="relative">
              <input
                {...register("username")}
                className={`mt-1 w-full rounded-xl bg-black/40 border px-3 py-2 pr-10 ${
                  errors.username 
                    ? 'border-red-500' 
                    : usernameStatus.available === true
                    ? 'border-emerald-500'
                    : usernameStatus.available === false
                    ? 'border-red-500'
                    : 'border-zinc-800'
                }`}
              />
              {username && username.length >= 3 && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  {usernameStatus.checking ? (
                    <Loader2 size={18} className="text-gray-400 animate-spin" />
                  ) : usernameStatus.available === true ? (
                    <CheckCircle2 size={18} className="text-emerald-400" />
                  ) : usernameStatus.available === false ? (
                    <XCircle size={18} className="text-red-400" />
                  ) : null}
                </div>
              )}
            </div>
            {errors.username && (
              <p className="text-red-400 text-xs mt-1">{errors.username.message}</p>
            )}
            {usernameStatus.available === false && !errors.username && (
              <p className="text-red-400 text-xs mt-1">{usernameStatus.message}</p>
            )}
            {usernameStatus.available === true && !errors.username && (
              <p className="text-emerald-400 text-xs mt-1">Username is available</p>
            )}
          </div>

          {/* PASSWORD */}
          <div>
            <label className="text-sm text-gray-300">Password</label>
            <input
              type="password"
              {...register("password")}
              className={`mt-1 w-full rounded-xl bg-black/40 border px-3 py-2 ${
                errors.password ? 'border-red-500' : 'border-zinc-800'
              }`}
            />
            {errors.password && (
              <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              Must be 8+ characters with uppercase, lowercase, and number
            </p>
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
