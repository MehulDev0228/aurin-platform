// src/components/ThemeShell.tsx
import DottedGrid from "./aceternity/DottedGrid";
import BackgroundBeams from "./aceternity/BackgroundBeams";

export default function ThemeShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen bg-black text-white">
      <DottedGrid />
      <BackgroundBeams className="pointer-events-none" />
      {children}
    </div>
  );
}
