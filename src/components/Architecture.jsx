import React, { useRef } from 'react';

export default function Architecture({ theme = 'light' }) {
  const archRef = useRef(null);
  const isDark = theme === 'dark';

  const steps = [
    {
      step: '01 / INGESTION',
      stepColor: isDark ? 'text-purple-400' : 'text-purple-600',
      title: 'Git Extract',
      description: 'Clones repo, parses commit logs & git blame churn per file.'
    },
    {
      step: '02 / RANKING',
      stepColor: isDark ? 'text-purple-400' : 'text-purple-600',
      title: 'Churn & Overlap',
      description: 'Ranks files by edit frequency, lines changed & maintainer density.'
    },
    {
      step: '03 / AUDIT',
      stepColor: isDark ? 'text-amber-400' : 'text-amber-600',
      title: 'Low-Conf Repair',
      description: 'Flags vague commit messages ("fix stuff") & correlates PR metadata.'
    },
    {
      step: '04 / SYNTHESIS',
      stepColor: isDark ? 'text-emerald-400' : 'text-emerald-600',
      title: 'LLM Tour Generator',
      description: 'Generates step-by-step narrative and voice narration scripts.'
    }
  ];

  return (
    <section 
      ref={archRef}
      id="architecture" 
      className={`relative w-full pt-8 sm:pt-10 pb-16 md:pb-24 px-6 overflow-hidden flex flex-col items-center text-center select-none transition-colors duration-300 ${
        isDark ? 'bg-[#09090b] text-slate-100' : 'bg-white text-slate-900'
      }`}
    >
      {/* Top soft gradient fade overlay */}
      <div 
        className={`absolute top-0 left-0 right-0 h-16 sm:h-20 pointer-events-none z-1 bg-gradient-to-b ${
          isDark 
            ? 'from-[#09090b] via-[#09090b]/80 to-transparent' 
            : 'from-white via-white/80 to-transparent'
        }`} 
      />

      <div className="relative z-10 max-w-7xl mx-auto flex flex-col items-center text-center w-full">
        {/* Main Section Heading */}
        <h2 className={`text-3xl sm:text-4xl md:text-5xl font-black tracking-tight mb-3 max-w-4xl ${
          isDark ? 'text-white' : 'text-slate-900'
        }`}>
          4-Layer Ingestion & Narrative Pipeline
        </h2>

        {/* Subtitle */}
        <p className={`text-base sm:text-lg max-w-2xl leading-relaxed mb-8 sm:mb-10 font-normal ${
          isDark ? 'text-slate-300' : 'text-slate-600'
        }`}>
          How Onboarding Ghost transforms raw repository commits into verifiable codebase tours.
        </p>

        {/* 4 Pipeline Step Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
          {steps.map((item, idx) => (
            <div
              key={idx}
              className={`rounded-3xl p-6 sm:p-8 flex flex-col items-start text-left border transition-all duration-300 hover:-translate-y-1.5 ${
                isDark 
                  ? 'bg-[#12121a]/90 backdrop-blur-md border-slate-800 text-slate-100 hover:border-slate-700 hover:shadow-2xl' 
                  : 'bg-white/95 backdrop-blur-md border-black text-slate-900 hover:shadow-xl'
              }`}
            >
              {/* Step Number Tag */}
              <div className={`text-xs font-bold font-mono ${item.stepColor} tracking-wider mb-4 uppercase`}>
                {item.step}
              </div>

              {/* Title */}
              <h3 className={`text-lg sm:text-xl font-bold mb-3 tracking-tight ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}>
                {item.title}
              </h3>

              {/* Description */}
              <p className={`text-sm leading-relaxed ${
                isDark ? 'text-slate-400' : 'text-slate-600'
              }`}>
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
