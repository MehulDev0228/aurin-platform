// src/pages/Terms.tsx
export default function Terms() {
  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold">Terms of Service</h1>
        <p className="text-gray-300 mt-4">
          Welcome to AURIN. By accessing or using our services, you agree to these Terms. If you do not agree,
          please do not use the service.
        </p>
        <h2 className="mt-6 text-xl font-semibold">1. Use of Service</h2>
        <p className="text-gray-300 mt-2">You may use AURIN to create events and award badges to participants.</p>
        <h2 className="mt-6 text-xl font-semibold">2. Accounts</h2>
        <p className="text-gray-300 mt-2">You are responsible for your account and keeping your credentials secure.</p>
        <h2 className="mt-6 text-xl font-semibold">3. Badges & Blockchain</h2>
        <p className="text-gray-300 mt-2">
          On-chain badges involve third-party networks. Fees, confirmation times, and availability depend on the network.
        </p>
        <h2 className="mt-6 text-xl font-semibold">4. Acceptable Use</h2>
        <p className="text-gray-300 mt-2">No unlawful content, spam, or abuse of the platform.</p>
        <h2 className="mt-6 text-xl font-semibold">5. Changes</h2>
        <p className="text-gray-300 mt-2">We may update these Terms; continued use means acceptance.</p>
        <h2 className="mt-6 text-xl font-semibold">6. Contact</h2>
        <p className="text-gray-300 mt-2">Questions? Contact support@aurin.example</p>
      </div>
    </div>
  );
}
