import React, { useState, useRef } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import LiveDemo from './components/LiveDemo';
import Architecture from './components/Architecture';
import Footer from './components/Footer';
import CustomTriangularCursor from './components/CustomTriangularCursor';

export default function App() {
  const [theme, setTheme] = useState('light'); // 'light' | 'dark'
  const cursorZoneRef = useRef(null);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const isDark = theme === 'dark';

  return (
    <div className={`min-h-screen ${isDark ? 'bg-[#09090b] text-slate-100' : 'bg-white text-slate-900'} flex flex-col font-['Plus_Jakarta_Sans',sans-serif] transition-colors duration-300`}>
      <Navbar theme={theme} toggleTheme={toggleTheme} />
      <main className="flex-1 flex flex-col items-center w-full">
        <Hero theme={theme} />
        {/* Continuous unified cursor zone spanning Features, LiveDemo, and Architecture */}
        <div ref={cursorZoneRef} className="w-full flex flex-col items-center relative">
          <CustomTriangularCursor containerRef={cursorZoneRef} theme={theme} />
          <Features theme={theme} />
          <LiveDemo theme={theme} />
          <Architecture theme={theme} />
        </div>
      </main>
      <Footer theme={theme} />
    </div>
  );
}
