// src/pages/Privacy.tsx
export default function Privacy() {
  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold">Privacy Policy</h1>
        <p className="text-gray-300 mt-4">
          AURIN collects account data (email, username), event data, and optional wallet details to power features.
        </p>
        <h2 className="mt-6 text-xl font-semibold">1. Data We Collect</h2>
        <ul className="text-gray-300 list-disc pl-6 mt-2">
          <li>Account: email, username</li>
          <li>Profile: optional wallet address & signature</li>
          <li>Usage: events created, enrollments, achievements</li>
        </ul>
        <h2 className="mt-6 text-xl font-semibold">2. How We Use Data</h2>
        <p className="text-gray-300 mt-2">Provide, secure, and improve AURIN; support on-chain features.</p>
        <h2 className="mt-6 text-xl font-semibold">3. Sharing</h2>
        <p className="text-gray-300 mt-2">We don’t sell your data. On-chain actions are public by design.</p>
        <h2 className="mt-6 text-xl font-semibold">4. Security</h2>
        <p className="text-gray-300 mt-2">We use Supabase RLS and least-privilege access.</p>
        <h2 className="mt-6 text-xl font-semibold">5. Your Choices</h2>
        <p className="text-gray-300 mt-2">You can delete your account or unlink your wallet any time.</p>
        <h2 className="mt-6 text-xl font-semibold">6. Contact</h2>
        <p className="text-gray-300 mt-2">privacy@aurin.example</p>
      </div>
    </div>
  );
}
