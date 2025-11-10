// src/components/BadgeShowcase.tsx
import SpotlightCard from "./aceternity/SpotlightCard";

export default function BadgeShowcase() {
  return (
    <section className="py-16">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-6 items-stretch">
          <SpotlightCard>
            <h3 className="text-xl font-semibold">Featured Badge</h3>
            <p className="text-gray-300 mt-2">
              Trusted by universities and enterprises worldwide. Each badge is verifiable.
            </p>
            <div className="mt-5 grid grid-cols-3 gap-3">
              <Cell title="Holders" value="15.2K" />
              <Cell title="Completion" value="96%" />
              <Cell title="Rating" value="4.9" />
            </div>
            <div className="mt-6 text-sm text-gray-400">
              Token: 0x27f9...4d8c • Base L2
            </div>
          </SpotlightCard>

          <SpotlightCard>
            <h3 className="text-xl font-semibold">Why it matters</h3>
            <ul className="mt-3 grid gap-2 text-gray-300 text-sm">
              <li>• Verifiable skills that travel with you</li>
              <li>• Employer-grade authenticity</li>
              <li>• No wallet required to start</li>
              <li>• On-chain permanence when you want it</li>
            </ul>
          </SpotlightCard>
        </div>
      </div>
    </section>
  );
}

function Cell({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-2xl bg-black/30 border border-zinc-800 p-4">
      <div className="text-xl font-semibold">{value}</div>
      <div className="text-gray-400 text-xs mt-1">{title}</div>
    </div>
  );
}
