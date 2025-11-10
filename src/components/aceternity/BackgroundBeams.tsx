// src/components/aceternity/BackgroundBeams.tsx
export default function BackgroundBeams({ className = '' }: { className?: string }) {
  return (
    <div className={`fixed inset-0 -z-10 overflow-hidden ${className}`}>
      <div className="absolute -top-1/3 left-1/2 h-[120vh] w-[120vh] -translate-x-1/2 rounded-full
                      bg-[conic-gradient(from_90deg_at_50%_50%,rgba(16,185,129,0.12),transparent_35%,transparent_65%,rgba(16,185,129,0.12))]
                      blur-2xl" />
    </div>
  );
}
