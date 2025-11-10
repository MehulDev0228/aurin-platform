// src/components/ui/use-toast.tsx
import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import type { Toast } from "./toast";

type Ctx = {
  toasts: Toast[];
  toast: (t: Omit<Toast, "id">) => { id: string };
  dismiss: (id: string) => void;
  clear: () => void;
};

const ToastContext = createContext<Ctx | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const idRef = useRef(0);

  const dismiss = useCallback((id: string) => {
    setToasts((list) => list.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    (t: Omit<Toast, "id">) => {
      const id = String(++idRef.current);
      const duration = t.duration ?? 3500;
      const next: Toast = { id, ...t };
      setToasts((list) => [...list, next]);
      if (duration > 0) {
        setTimeout(() => dismiss(id), duration);
      }
      return { id };
    },
    [dismiss]
  );

  const clear = useCallback(() => setToasts([]), []);

  const value = useMemo(() => ({ toasts, toast, dismiss, clear }), [toasts, toast, dismiss, clear]);

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>;
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within a ToastProvider");
  return ctx;
}

// shadcn-style convenience export
export const toast = (_t: Omit<Toast, "id">) => {
  // Only warn in development
  if (import.meta.env.DEV) {
    // eslint-disable-next-line no-console
    console.warn("Direct `toast()` called but no provider reference. Prefer `const {toast}=useToast()` inside components.");
  }
  return { id: "0" };
};
