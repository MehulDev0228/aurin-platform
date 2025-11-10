// src/components/HowItWorks.tsx
import RippleButton from "./aceternity/RippleButton";
import SpotlightCard from "./aceternity/SpotlightCard";

const steps = [
  { n: 1, title: "Create event", text: "Add details, categories, and visibility. Invite participants." },
  { n: 2, title: "Issue badges", text: "Award instantly off-chain or mint on Base L2 for permanence." },
  { n: 3, title: "Verify anywhere", text: "Share a public link or scan QR. One-click authenticity." },
];

export default function HowItWorks() {
  return (
    <section className="py-16">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-center">How it works</h2>
        <p className="text-gray-400 text-center mt-2">Launch in minutes — scale to thousands.</p>

        <div className="mt-8 grid md:grid-cols-3 gap-6">
          {steps.map(s => (
            <SpotlightCard key={s.n}>
              <div className="text-emerald-300 text-sm mb-2">Step {s.n}</div>
              <div className="text-lg font-semibold">{s.title}</div>
              <p className="text-gray-300 mt-2 text-sm">{s.text}</p>
            </SpotlightCard>
          ))}
        </div>

        <div className="mt-8 flex justify-center">
          <RippleButton className="px-6 py-3 rounded-xl bg-white text-black font-semibold">
            Get started
          </RippleButton>
        </div>
      </div>
    </section>
  );
}
