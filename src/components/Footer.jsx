import React from 'react';

export default function Footer({ theme = 'light' }) {
  const isDark = theme === 'dark';

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToDemo = (e) => {
    e.preventDefault();
    const demoEl = document.getElementById('demo');
    if (demoEl) {
      demoEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className={`w-full py-8 px-6 border-t transition-colors duration-300 ${
      isDark ? 'bg-[#09090b] border-slate-800 text-slate-300' : 'bg-white border-black text-slate-900'
    }`}>
      <div className={`max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-medium ${
        isDark ? 'text-slate-400' : 'text-slate-700'
      }`}>
        {/* Left Branding */}
        <div>
          <span className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Onboarding Ghost</span>
          <span className="mx-2 text-slate-500">•</span>
          <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>AI Codebase Tours Grounded in Git History</span>
        </div>

        {/* Right Navigation Links */}
        <div className="flex items-center gap-6">
          <button
            onClick={scrollToTop}
            className={`transition-colors cursor-pointer ${isDark ? 'hover:text-purple-400' : 'hover:text-purple-600'}`}
          >
            Back to top
          </button>
          <a
            href="#demo"
            onClick={scrollToDemo}
            className={`transition-colors cursor-pointer ${isDark ? 'hover:text-purple-400' : 'hover:text-purple-600'}`}
          >
            Live Demo
          </a>
        </div>
      </div>
    </footer>
  );
}
