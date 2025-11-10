// src/components/aceternity/RippleButton.tsx
import { useRef } from 'react';

export default function RippleButton({
  children, className = '', onClick, disabled
}: { children: React.ReactNode; className?: string; onClick?: () => void; disabled?: boolean }) {
  const ref = useRef<HTMLButtonElement>(null);

  const ripple = (e: React.MouseEvent) => {
    const btn = ref.current; if (!btn) return;
    const circle = document.createElement('span');
    const d = Math.max(btn.clientWidth, btn.clientHeight);
    const r = btn.getBoundingClientRect();
    circle.style.width = circle.style.height = `${d}px`;
    circle.style.left = `${e.clientX - r.left - d / 2}px`;
    circle.style.top = `${e.clientY - r.top - d / 2}px`;
    circle.className = 'absolute rounded-full bg-white/30 animate-[ripple_600ms_ease-out] pointer-events-none';
    btn.appendChild(circle);
    setTimeout(() => circle.remove(), 650);
  };

  return (
    <button
      ref={ref}
      onClick={(e) => { ripple(e); onClick?.(); }}
      disabled={disabled}
      className={`relative overflow-hidden ${className}`}
    >
      {children}
      <style>{`@keyframes ripple{to{transform:scale(2.5);opacity:0;}}`}</style>
    </button>
  );
}
