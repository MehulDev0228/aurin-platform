import { Award, Github, Twitter, Linkedin } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0A0A0A] border-t border-white/5 py-16 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="space-y-4">
            <div className="flex items-center gap-3 font-bold text-xl">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
                <Award size={20} />
              </div>
              <span className="tracking-tight">Aurin</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              The permanent, blockchain-verified record of your professional achievements.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-sm tracking-wide text-emerald-400">Product</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <a href="#features" className="hover:text-white smooth-transition">
                  Features
                </a>
              </li>
              <li>
                <a href="#explore" className="hover:text-white smooth-transition">
                  Explore Badges
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white smooth-transition">
                  For Issuers
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white smooth-transition">
                  Pricing
                </a>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-sm tracking-wide text-emerald-400">Company</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <a href="#about" className="hover:text-white smooth-transition">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white smooth-transition">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white smooth-transition">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white smooth-transition">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-sm tracking-wide text-emerald-400">Legal</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <a href="#" className="hover:text-white smooth-transition">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white smooth-transition">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white smooth-transition">
                  Cookie Policy
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-400">
            © {currentYear} Aurin by Elyvra. All rights reserved.
          </p>

          <div className="flex items-center gap-4">
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-emerald-400 smooth-transition"
              aria-label="Twitter"
            >
              <Twitter size={20} />
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-emerald-400 smooth-transition"
              aria-label="GitHub"
            >
              <Github size={20} />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-emerald-400 smooth-transition"
              aria-label="LinkedIn"
            >
              <Linkedin size={20} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
