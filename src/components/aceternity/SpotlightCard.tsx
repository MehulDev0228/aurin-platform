// src/components/aceternity/SpotlightCard.tsx
import { useRef } from 'react';

export default function SpotlightCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    const x = e.clientX - r.left, y = e.clientY - r.top;
    el.style.setProperty('--mx', `${x}px`);
    el.style.setProperty('--my', `${y}px`);
    const rx = ((y - r.height / 2) / r.height) * -6;
    const ry = ((x - r.width / 2) / r.width) * 6;
    el.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`;
  };

  const onLeave = () => {
    const el = ref.current; if (!el) return;
    el.style.transform = `rotateX(0deg) rotateY(0deg)`;
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={`relative rounded-3xl border border-zinc-800 bg-zinc-950/60 p-6 transition-transform will-change-transform ${className}`}
      style={{
        background:
          'radial-gradient(120px circle at var(--mx,50%) var(--my,50%), rgba(255,255,255,0.06), transparent 60%)',
      }}
    >
      {children}
    </div>
  );
}
