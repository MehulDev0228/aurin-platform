// src/components/aceternity/SparklesText.tsx
export default function SparklesText({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`relative inline-block ${className}`}>
      {children}
      <span className="absolute -inset-1 rounded-lg bg-[radial-gradient(circle_at_20%_20%,rgba(16,185,129,0.22),transparent_35%),radial-gradient(circle_at_80%_30%,rgba(255,255,255,0.15),transparent_35%)] blur-md opacity-60 pointer-events-none" />
    </span>
  );
}
