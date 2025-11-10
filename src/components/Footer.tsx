// src/components/Footer.tsx
export default function Footer() {
  return (
    <footer className="bg-black border-t border-zinc-900">
      <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="text-white font-semibold">AURIN</div>
          <div className="text-sm text-gray-400">Verifiable badges for events</div>
        </div>
        <div className="flex gap-6 text-sm">
          <a href="/terms" className="text-gray-300 hover:text-white">Terms</a>
          <a href="/privacy" className="text-gray-300 hover:text-white">Privacy</a>
          <a href="/explore" className="text-gray-300 hover:text-white">Explore</a>
        </div>
        <div className="text-sm text-gray-500">© {new Date().getFullYear()} AURIN</div>
      </div>
    </footer>
  );
}
