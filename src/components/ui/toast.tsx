// src/components/ui/toast.tsx
export type ToastAction = {
  label: string;
  onClick?: () => void;
};

export type Toast = {
  id: string;
  title?: string;
  description?: string;
  variant?: "default" | "success" | "destructive";
  action?: ToastAction;
  duration?: number; // ms
};
