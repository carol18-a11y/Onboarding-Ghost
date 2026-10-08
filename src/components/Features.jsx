import React, { useState, useEffect, useRef } from 'react';
import { ParticleTextEffect } from './ui/particle-text-effect';
import GradientCard from './ui/gradient-card';
import CustomTriangularCursor from './CustomTriangularCursor';

export default function Features({ theme = 'light' }) {
  const isDark = theme === 'dark';

  const sectionRef = useRef(null);
  const [revealed, setRevealed] = useState([false, false, false, false]);
  const gridRef = useRef(null);
  const cardRefs = useRef([]);

  useEffect(() => {
    if (revealed.every(Boolean)) return;

    const checkScroll = () => {
      if (!gridRef.current) return;
      const vh = window.innerHeight;
      const gridRect = gridRef.current.getBoundingClientRect();

      setRevealed((prev) => {
        if (prev.every(Boolean)) return prev;

        const next = [...prev];
        let changed = false;

        const triggerLine = vh * 0.78;
        for (let i = 0; i < 4; i++) {
          if (!next[i]) {
            const cardEl = cardRefs.current[i];
            const cardTop = cardEl ? cardEl.getBoundingClientRect().top : gridRect.top;

            const desktopStepTrigger = gridRect.top <= (triggerLine - i * 180);
            const elementTrigger = cardTop <= triggerLine;

            if (desktopStepTrigger || elementTrigger) {
              next[i] = true;
              changed = true;
            }
          }
        }

        return changed ? next : prev;
      });
    };

    checkScroll();

    let rafId = null;
    const handleScroll = () => {
      if (!rafId) {
        rafId = requestAnimationFrame(() => {
          checkScroll();
          rafId = null;
        });
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [revealed]);

  const features = [
    {
      title: "Git Churn Ranking",
      description: "Extracts file churn metrics and author overlap to highlight core architecture hubs rather than static file trees.",
      gradient: "purple",
    },
    {
      title: "History Confidence Inspector",
      description: "Analysis layer flags vague commit messages like 'fix stuff' and repairs context using PR metadata.",
      gradient: "orange",
    },
    {
      title: "AI Voice Narration",
      description: "Integrated text-to-speech audio narrator explains complex code decisions hands-free as you step through the tour.",
      gradient: "pink",
    },
    {
      title: "Live Git Blame Inspection",
      description: "Hover any line of code to inspect exact commit hashes, author ownership percentages, and milestone PR diffs.",
      gradient: "cyan",
    },
  ];

  return (
    <section 
      ref={sectionRef}
      id="features" 
      className={`w-full pt-8 sm:pt-12 pb-16 md:pb-24 px-6 relative transition-colors duration-300 ${
        isDark ? 'bg-[#09090b] text-slate-100' : 'bg-white text-slate-900'
      }`}
    >
      {/* Custom Triangular Cursor with Centered Instruction for Features Section */}
      <CustomTriangularCursor containerRef={sectionRef} theme={theme} />

      <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
        {/* Category Badge */}
        <span className="text-xs sm:text-sm font-bold tracking-widest text-purple-500 uppercase mb-3 block">
          WHY ONBOARDING GHOST?
        </span>

        {/* Main Section Heading with Particle Text Effect */}
        <div className="mb-4 w-full max-w-4xl flex justify-center min-h-[140px] items-center">
          <ParticleTextEffect
            words={["Bridging the Gap Between", "Code & Historical Context"]}
            theme={theme}
            once={true}
            pixelSteps={4}
          />
        </div>

        {/* Subtitle */}
        <p className={`text-base sm:text-lg max-w-2xl leading-relaxed mb-14 font-normal ${
          isDark ? 'text-slate-300' : 'text-slate-600'
        }`}>
          Commit history and blame data sit unused while new developers waste days navigating complex codebases. Onboarding Ghost brings that context to life.
        </p>

        {/* Feature Cards Grid */}
        <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
          {features.map((feature, idx) => (
            <div
              key={idx}
              ref={(el) => (cardRefs.current[idx] = el)}
              className={`w-full h-full ${
                revealed[idx]
                  ? 'opacity-100 translate-y-0 blur-0 pointer-events-auto'
                  : 'opacity-0 translate-y-6 blur-[4px] pointer-events-none'
              }`}
              style={{
                transition: 'opacity 600ms cubic-bezier(0.16, 1, 0.3, 1), transform 600ms cubic-bezier(0.16, 1, 0.3, 1), filter 600ms cubic-bezier(0.16, 1, 0.3, 1)',
                willChange: 'transform, opacity, filter',
              }}
            >
              <GradientCard
                title={feature.title}
                description={feature.description}
                gradient={feature.gradient}
                isDark={isDark}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
