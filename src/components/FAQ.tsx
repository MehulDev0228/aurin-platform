import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "What are digital badges?",
      answer: "Digital badges are blockchain-verified credentials that prove your skills, achievements, and participation in events. They're like certificates, but verifiable, shareable, and permanent."
    },
    {
      question: "How do I earn badges?",
      answer: "You can earn badges by completing courses, attending events, demonstrating skills, or achieving milestones. Event organizers and badge issuers award badges directly to participants."
    },
    {
      question: "Are badges stored on the blockchain?",
      answer: "Yes! Every badge is minted as an NFT on the blockchain, making it permanently verifiable, tamper-proof, and truly yours. You maintain full ownership."
    },
    {
      question: "Do I need cryptocurrency to use Aurin?",
      answer: "No! We handle all blockchain transactions for you. You don't need to buy crypto or pay gas fees. Just sign up and start earning badges."
    },
    {
      question: "Can I share my badges?",
      answer: "Absolutely! Your badges are displayed on your public profile, which you can share with employers, on social media, or add to your resume. Each badge is verifiable by anyone."
    },
    {
      question: "How do I become an event organizer?",
      answer: "Click 'Become Organizer' from your dashboard. You'll create an organizer profile and can immediately start hosting events and issuing badges to attendees."
    },
    {
      question: "Is Aurin free to use?",
      answer: "Yes! Creating an account, earning badges, and showcasing your achievements is completely free for users. Organizers may have premium features available."
    },
    {
      question: "How are badges verified?",
      answer: "Each badge is linked to a blockchain transaction that proves authenticity. Anyone can verify a badge by checking its blockchain record - no central authority needed."
    }
  ];

  return (
    <section id="faq" className="relative py-32 px-6 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.05),transparent_70%)]" />

      <div className="relative max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-6">
            Frequently Asked
            <br />
            <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
              Questions
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Everything you need to know about digital badges and blockchain verification
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden transition-all duration-300 hover:border-emerald-500/30"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full p-6 text-left flex items-center justify-between gap-4"
              >
                <h3 className="text-lg font-semibold">{faq.question}</h3>
                <ChevronDown
                  size={24}
                  className={`text-emerald-400 flex-shrink-0 transition-transform duration-300 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? 'max-h-96' : 'max-h-0'
                }`}
              >
                <p className="px-6 pb-6 text-gray-400 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-400 mb-4">Still have questions?</p>
          <a
            href="mailto:support@aurin.com"
            className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 font-semibold hover:bg-emerald-500/20 transition-all"
          >
            Contact Support
          </a>
        </div>
      </div>
    </section>
  );
}
