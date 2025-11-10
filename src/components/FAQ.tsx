// src/components/FAQ.tsx
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

type Item = { q: string; a: string };

const items: Item[] = [
  {
    q: 'Are badges on-chain by default?',
    a: 'Issuers can choose: instant off-chain for speed or Base L2 for permanence. On-chain badges are cryptographically verifiable.',
  },
  {
    q: 'Do recipients need a wallet?',
    a: 'No. Recipients can claim off-chain first and link a wallet later. If a wallet is connected, we mint on-chain on award.',
  },
  {
    q: 'What does verification look like?',
    a: 'Each badge has a verification page with issuer signature and optional transaction hash. One click “View on chain” for on-chain badges.',
  },
  {
    q: 'Can I migrate badges on-chain later?',
    a: 'Yes. Issuers can migrate select off-chain badges to on-chain with a bulk action when recipients connect wallets.',
  },
];

export default function FAQ() {
  return (
    <section className="py-16">
      <div className="max-w-5xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-center">Frequently Asked Questions</h2>
        <p className="text-gray-400 text-center mt-2">
          Everything you need to know about AURIN badges, verification, and wallets.
        </p>

        <div className="mt-8 divide-y divide-zinc-800 rounded-2xl border border-zinc-800 bg-black/40">
          {items.map((it, i) => (
            <Row key={i} {...it} />
          ))}
        </div>
      </div>
    </section>
  );
}

function Row({ q, a }: Item) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button
        className="w-full text-left px-5 py-4 flex items-center justify-between hover:bg-white/5 transition"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="font-medium">{q}</span>
        <ChevronDown
          size={18}
          className={`transition ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && (
        <div className="px-5 pb-5 text-gray-300">
          {a}
        </div>
      )}
    </div>
  );
}
