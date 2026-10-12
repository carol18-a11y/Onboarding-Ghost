import React, { useState, useRef } from 'react';
import { Github } from 'lucide-react';
import TrueFocus from './TrueFocus';
import SlideCommit from './SlideCommit';
import PixelGridCanvas from './PixelGridCanvas';
import BellToggle from './BellToggle';
import './SampleRepoChip.css';

const SAMPLE_REPOS = [
  'facebook/react',
  'vercel/next.js',
  'supabase/supabase'
];

export default function Hero({ theme = 'light' }) {
  const heroRef = useRef(null);
  const [repoUrl, setRepoUrl] = useState('https://github.com/facebook/react');
  const [statusText, setStatusText] = useState('');

  const isDark = theme === 'dark';

  const handleSampleClick = (repo) => {
    setRepoUrl(`https://github.com/${repo}`);
  };

  const handleConfirmTour = () => {
    return new Promise((resolve) => {
      setStatusText('Generating AI Codebase Tour...');
      setTimeout(() => {
        setStatusText('Tour Ready!');
        resolve();
      }, 1200);
    });
  };

  const currentRepoName = repoUrl.replace('https://github.com/', '');

  return (
    <section 
      ref={heroRef} 
      className={`relative w-full pt-20 sm:pt-24 pb-28 px-6 overflow-hidden flex flex-col items-center text-center select-none transition-colors duration-300 ${
        isDark ? 'bg-[#09090b] text-slate-100' : 'bg-white text-slate-900'
      }`}
    >
      {/* Interactive Pixel Grid Canvas Background */}
      <PixelGridCanvas containerRef={heroRef} theme={theme} />

      {/* Soft gradient fade overlay at the bottom to smoothly dissolve grid into next section */}
      <div 
        className={`absolute bottom-0 left-0 right-0 h-28 sm:h-36 pointer-events-none z-1 bg-gradient-to-b ${
          isDark 
            ? 'from-transparent via-[#09090b]/80 to-[#09090b]' 
            : 'from-transparent via-white/80 to-white'
        }`} 
      />

      {/* Hero Content (Layered above canvas) */}
      <div className="relative z-10 w-full max-w-5xl mx-auto flex flex-col items-center text-center">
        {/* 
          1. Main Headline with TrueFocus on "Blindly"
        */}
        <h1 className={`text-5xl sm:text-6xl md:text-7xl font-black tracking-tight mb-6 leading-tight max-w-5xl ${
          isDark ? 'text-white' : 'text-slate-900'
        }`}>
          Stop Navigating Unfamiliar Codebases{' '}
          <TrueFocus 
            sentence="Blindly"
            borderColor="#7c3aed"
            glowColor="rgba(124, 58, 237, 0.5)"
            animationDuration={0.35}
          />
        </h1>

        {/* 
          2. Secondary Subtitle
        */}
        <p className={`text-lg sm:text-xl md:text-2xl max-w-3xl font-normal leading-relaxed mb-10 ${
          isDark ? 'text-slate-300' : 'text-slate-600'
        }`}>
          Onboarding Ghost analyzes git commit logs, churn rates, and contributor blame overlap to generate interactive, AI-narrated tours explaining why things were built the way they were.
        </p>

        {/* 
          3. Repository Input Box
        */}
        <div className={`w-full max-w-3xl rounded-[20px] p-2.5 backdrop-blur-md flex items-center justify-between gap-3 mb-6 border ${
          isDark 
            ? 'bg-[#12121a]/90 border-slate-700 shadow-2xl' 
            : 'bg-white border-black shadow-xl'
        }`}>
          {/* Inner GitHub Input Box */}
          <div className={`flex items-center gap-3 px-3.5 py-2.5 rounded-[14px] flex-1 border ${
            isDark 
              ? 'bg-[#090910] border-slate-700' 
              : 'bg-slate-50/80 border-black'
          }`}>
            <Github className="w-5 h-5 text-purple-600 shrink-0" />
            <input
              type="text"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              placeholder="https://github.com/owner/repo"
              className={`w-full bg-transparent font-mono text-sm sm:text-base outline-none ${
                isDark 
                  ? 'text-slate-100 placeholder:text-slate-500' 
                  : 'text-slate-900 placeholder:text-slate-400'
              }`}
            />
          </div>

          {/* Start AI Tour Button on Right */}
          <div className="shrink-0">
            <SlideCommit
              label="Start AI Tour"
              doneLabel="Tour Started!"
              errorLabel="Try Again"
              width={195}
              height={48}
              onConfirm={handleConfirmTour}
            />
          </div>
        </div>

        {statusText && (
          <div className="text-sm font-semibold text-purple-500 mb-3 animate-pulse">
            {statusText}
          </div>
        )}

        {/* Sample Repositories */}
        <div className="flex items-center gap-3 flex-wrap justify-center text-xs md:text-sm text-slate-500 mt-2">
          <span className={`font-semibold mr-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
            Try Sample Repos:
          </span>

          {SAMPLE_REPOS.map((repo) => {
            const isSelected = currentRepoName === repo;
            return (
              <BellToggle
                key={repo}
                offLabel={repo}
                onLabel={repo}
                pressed={isSelected}
                onChange={() => handleSampleClick(repo)}
                showIcon={false}
                size="sm"
                radius={9999}
                color={isDark ? '#e2e8f0' : '#0f172a'}
                background={isDark ? '#18181b' : '#f1f5f9'}
                onColor="#ffffff"
                onBackground="#000000"
                crossfadeMs={200}
                waves={false}
                badge={false}
                clapper={false}
                className={`font-mono transition-all duration-200 rounded-full ${
                  isSelected
                    ? 'ring-2 ring-black dark:ring-white shadow-[0_2px_8px_rgba(0,0,0,0.3)]'
                    : isDark
                    ? 'border border-slate-700 hover:border-slate-500 hover:shadow-xs'
                    : 'border border-slate-300 hover:border-black/50 hover:shadow-xs'
                }`}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
