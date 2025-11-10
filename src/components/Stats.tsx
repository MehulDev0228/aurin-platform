// src/components/Stats.tsx
export default function Stats() {
  return (
    <section className="border-t border-zinc-900/60">
      <div className="max-w-6xl mx-auto px-6 py-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Trust value="100%" label="Blockchain Verified" sub="Every on-chain badge" />
        <Trust value="<$0.01" label="Cost Per Badge" sub="At Base L2 scale" />
        <Trust value="Base L2" label="Network" sub="Fast & secure" />
        <Trust value="∞" label="Years Permanent" sub="Forever (on-chain)" />
      </div>
    </section>
  );
}
function Trust({ value, label, sub }: { value: string; label: string; sub?: string }) {
  return (
    <div className="text-center sm:text-left">
      <div className="text-2xl font-semibold">{value}</div>
      <div className="text-gray-300 mt-1">{label}</div>
      {sub && <div className="text-gray-500 text-sm">{sub}</div>}
    </div>
  );
}
