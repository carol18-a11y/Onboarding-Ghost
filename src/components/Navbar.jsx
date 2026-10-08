import React from 'react';
import { Sun, Moon } from 'lucide-react';
import ShinyButton from './ui/shiny-button';

export default function Navbar({ theme, toggleTheme }) {
  const isDark = theme === 'dark';

  return (
    <header className={`w-full border-b z-20 relative transition-colors duration-300 ${
      isDark ? 'bg-[#09090b] border-slate-800' : 'bg-white border-black'
    }`}>
      <div className="w-full max-w-7xl mx-auto px-6 md:px-10 py-5 flex items-center justify-between">
        {/* Top left spacer */}
        <div className="flex-1"></div>

        {/* Center Navigation Links */}
        <nav className={`hidden md:flex items-center gap-8 text-[17px] md:text-lg font-medium transition-colors ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
          <a href="#home" className={`transition-colors ${isDark ? 'hover:text-purple-400' : 'hover:text-purple-600'}`}>Home</a>
          <a href="#features" className={`transition-colors ${isDark ? 'hover:text-purple-400' : 'hover:text-purple-600'}`}>Features</a>
          <a href="#demo" className={`transition-colors ${isDark ? 'hover:text-purple-400' : 'hover:text-purple-600'}`}>Live Tour Demo</a>
          <a href="#architecture" className={`transition-colors ${isDark ? 'hover:text-purple-400' : 'hover:text-purple-600'}`}>Architecture</a>
        </nav>

        {/* Right Action Buttons */}
        <div className="flex-1 flex justify-end items-center gap-3 ml-auto">
          {/* Theme Toggle Button */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle dark/light theme"
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className={`p-2.5 rounded-full border transition-all cursor-pointer flex items-center justify-center shadow-xs ${
              isDark
                ? 'bg-[#181825] border-slate-700 text-amber-400 hover:bg-[#222235]'
                : 'bg-slate-100 border-black text-purple-600 hover:bg-slate-200'
            }`}
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          <ShinyButton className="!px-4.5 !py-2 !text-[15px]">
            View Demo
          </ShinyButton>

          <button className="px-4.5 py-2 text-[15px] font-semibold text-white bg-purple-600 rounded-full hover:bg-purple-500 transition-all shadow-sm cursor-pointer flex items-center gap-1.5 border border-purple-500/30">
            <span className="text-base font-normal">+</span> Ingest Repo
          </button>
        </div>
      </div>
    </header>
  );
}
