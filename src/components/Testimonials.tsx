// src/components/Testimonials.tsx
import SpotlightCard from "./aceternity/SpotlightCard";

const quotes = [
  { name: "Design Lead", body: "The cleanest credential UX we’ve tested. Instant verification is 🔥." },
  { name: "Product Manager", body: "Balanced speed and trust. Off-chain first with on-chain when we need it." },
  { name: "Testing Engineer", body: "Rock-solid flows. RLS and rate-limits are well-designed for scale." },
];

export default function Testimonials() {
  return (
    <section className="py-16">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-center">What teams say</h2>
        <div className="mt-8 grid md:grid-cols-3 gap-6">
          {quotes.map((q, i) => (
            <SpotlightCard key={i}>
              <p className="text-gray-300">{q.body}</p>
              <div className="mt-4 text-sm text-gray-400">— {q.name}</div>
            </SpotlightCard>
          ))}
        </div>
      </div>
    </section>
  );
}
