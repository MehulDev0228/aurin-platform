// src/pages/NotFound.tsx
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
      <div className="max-w-lg w-full text-center">
        <h1 className="text-4xl font-bold">404</h1>
        <p className="text-gray-300 mt-3">The page you’re looking for doesn’t exist.</p>
        <div className="mt-6 flex justify-center gap-3">
          <Link to="/" className="px-5 py-2 rounded-xl bg-white text-black font-semibold">Go home</Link>
          <Link to="/explore" className="px-5 py-2 rounded-xl border border-zinc-700">Explore</Link>
        </div>
      </div>
    </div>
  );
}
