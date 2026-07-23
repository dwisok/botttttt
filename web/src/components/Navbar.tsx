import { ChevronDown } from "lucide-react";

function Sunburst() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      className="text-white"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="3.4" />
      <line x1="12" y1="2" x2="12" y2="5" />
      <line x1="12" y1="19" x2="12" y2="22" />
      <line x1="2" y1="12" x2="5" y2="12" />
      <line x1="19" y1="12" x2="22" y2="12" />
      <line x1="4.9" y1="4.9" x2="7" y2="7" />
      <line x1="17" y1="17" x2="19.1" y2="19.1" />
      <line x1="4.9" y1="19.1" x2="7" y2="17" />
      <line x1="17" y1="7" x2="19.1" y2="4.9" />
    </svg>
  );
}

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-transparent px-6 py-4 flex items-center justify-between">
      {/* Left */}
      <a href="#top" className="flex items-center gap-2">
        <Sunburst />
        <span className="text-white font-semibold text-lg tracking-tight">sentinel</span>
      </a>

      {/* Center */}
      <div className="hidden md:flex items-center gap-8 text-sm font-medium text-white/80">
        <a href="#the-unit" className="flex items-center gap-1 hover:text-white transition-colors">
          The Unit
          <ChevronDown className="w-4 h-4" />
        </a>
        <a href="#operations" className="hover:text-white transition-colors">
          Operations
        </a>
        <a href="#token" className="hover:text-white transition-colors">
          $SNTL
        </a>
        <a href="#contacts" className="hover:text-white transition-colors">
          Pilot
        </a>
      </div>

      {/* Right */}
      <div className="flex items-center gap-4">
        <a
          href="#contacts"
          className="hidden sm:block text-sm font-medium text-white/80 hover:text-white transition-colors"
        >
          Book A Demo
        </a>
        <a
          href="#contacts"
          className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black transition-transform active:scale-95"
        >
          Get Started
        </a>
      </div>
    </nav>
  );
}
