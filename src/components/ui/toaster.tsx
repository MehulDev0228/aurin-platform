// src/components/ui/toaster.tsx
import { useToast } from "./use-toast";
import { X } from "lucide-react";

export default function Toaster() {
  const { toasts, dismiss } = useToast();

  return (
    <div className="pointer-events-none fixed top-4 right-4 z-[100] flex max-w-[92vw] flex-col gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={[
            "pointer-events-auto w-[360px] max-w-[92vw] rounded-2xl border px-4 py-3 shadow-xl backdrop-blur",
            "bg-black/80 border-zinc-800 text-white",
            t.variant === "destructive" ? "border-red-700/60" : "",
            t.variant === "success" ? "border-emerald-600/60" : "",
          ].join(" ")}
        >
          <div className="flex items-start gap-3">
            <div className="flex-1">
              {t.title && <div className="font-semibold">{t.title}</div>}
              {t.description && <div className="text-sm text-gray-300">{t.description}</div>}
            </div>
            <button
              className="rounded-md p-1 text-gray-400 hover:text-white hover:bg-white/10 transition"
              onClick={() => dismiss(t.id)}
              aria-label="Dismiss"
            >
              <X size={16} />
            </button>
          </div>
          {t.action && (
            <button
              className="mt-2 inline-flex items-center rounded-lg bg-white px-3 py-1.5 text-sm font-medium text-black hover:opacity-90"
              onClick={() => {
                t.action?.onClick?.();
                dismiss(t.id);
              }}
            >
              {t.action.label}
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
