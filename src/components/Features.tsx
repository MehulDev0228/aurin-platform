// src/components/Features.tsx
import { Globe, ShieldCheck, QrCode, Wallet } from "lucide-react";
import SpotlightCard from "./aceternity/SpotlightCard";

const items = [
  {
    icon: Globe,
    title: "Public Profile",
    bullets: [
      "Professional URL: aurin.com/username",
      "Stats dashboard & verification",
      "Achievement timeline by date",
      "Skills & categories organized",
    ],
  },
  {
    icon: ShieldCheck,
    title: "Blockchain Verified",
    bullets: [
      "Ethereum-based smart contracts",
      "Immutable records on Base L2",
      "One-click verification",
      "Migrate off-chain → on-chain anytime",
    ],
  },
  {
    icon: QrCode,
    title: "Instant Proof",
    bullets: [
      "QR code for scanning",
      "Verifier page per badge",
      "Issuer signature & tx hash",
      "Public share links",
    ],
  },
  {
    icon: Wallet,
    title: "Wallet Optional",
    bullets: [
      "Claim off-chain first",
      "Link wallet later",
      "On-chain mint when ready",
      "No friction for recipients",
    ],
  },
];

export default function Features() {
  return (
    <section className="py-16">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-center">Everything You Need</h2>
        <p className="text-gray-400 text-center mt-2">
          A complete platform to showcase, verify, and share achievements.
        </p>

        <div className="mt-10 grid md:grid-cols-2 gap-6">
          {items.map((it, i) => (
            <SpotlightCard key={i}>
              <div className="flex items-start gap-4">
                <div className="rounded-2xl bg-emerald-500/10 p-3 border border-emerald-500/20">
                  <it.icon className="text-emerald-300" size={22} />
                </div>
                <div className="flex-1">
                  <div className="text-lg font-semibold">{it.title}</div>
                  <ul className="mt-3 grid gap-2 text-gray-300 text-sm">
                    {it.bullets.map((b, bi) => (
                      <li key={bi} className="flex items-start gap-2">
                        <span className="mt-[6px] h-1.5 w-1.5 rounded-full bg-emerald-400/80" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </SpotlightCard>
          ))}
        </div>
      </div>
    </section>
  );
}
