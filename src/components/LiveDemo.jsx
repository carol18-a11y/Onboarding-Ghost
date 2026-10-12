import React, { useState, useRef } from 'react';
import { 
  BarChart3, 
  BookOpen, 
  FileCode2, 
  ChevronLeft, 
  ChevronRight, 
  HelpCircle, 
  Users, 
  History, 
  Code2, 
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

export default function LiveDemo({ theme = 'light' }) {
  const isDark = theme === 'dark';
  const sectionRef = useRef(null);

  const [activeStop, setActiveStop] = useState(0);
  const [activeTab, setActiveTab] = useState('story');
  const [presetFilter, setPresetFilter] = useState('New Dev');
  const [selectedRepo, setSelectedRepo] = useState('facebook/react (React Fiber Tour)');

  // Data for the 3 Tour Route Stops
  const tourData = [
    {
      stopNumber: 1,
      authorsCount: 3,
      title: 'Understanding the Reconciler Fiber Loop',
      filePath: 'packages/react-reconciler/src/ReactFiberWorkLoop.js',
      functionSummary: 'The central scheduler loop that orchestrates interruptible concurrent rendering and Fiber node tree traversing.',
      whyBuilt: 'Prior to Fiber, React used a synchronous recursive tree traversal that blocked the UI thread. This file replaced recursion with an iterative linked-list work loop.',
      maintainers: [
        { name: 'Dan Abramov', initials: 'DA', share: 58 },
        { name: 'Sebastian Markbåge', initials: 'SM', share: 32 },
        { name: 'Andrew Clark', initials: 'AC', share: 10 },
      ],
      commits: [
        {
          hash: '#e84f2b1',
          date: '2020-04-12',
          message: 'Refactor WorkLoop to support Concurrent Mode yielding',
          author: 'Sebastian Markbåge',
        },
        {
          hash: '#a10b49c',
          date: '2021-08-19',
          message: 'Fix unhandled errors during unwind phase in fiber loop',
          author: 'Dan Abramov',
        },
      ],
      codeLines: [
        { num: 1, code: 'function workLoopConcurrent() {', blame: 'Dan Abramov, 2021 (#a10b49c)' },
        { num: 2, code: '  // Perform work until Scheduler asks us to yield', blame: 'Sebastian Markbåge, 2020 (#e84f2b1)' },
        { num: 3, code: '  while (workInProgress !== null && !shouldYield()) {', blame: 'Sebastian Markbåge, 2020 (#e84f2b1)' },
        { num: 4, code: '    performUnitOfWork(workInProgress);', blame: 'Andrew Clark, 2019 (#c309f12)' },
        { num: 5, code: '  }', blame: 'Sebastian Markbåge, 2020 (#e84f2b1)' },
        { num: 6, code: '}', blame: 'Dan Abramov, 2021 (#a10b49c)' },
      ],
      audioNarration: 'Welcome to Stop 1. This module controls React Fiber’s main execution loop. Notice how performUnitOfWork processes fiber nodes incrementally to prevent dropping frames during heavy UI renders.',
    },
    {
      stopNumber: 2,
      authorsCount: 2,
      title: 'Hooks State Queue & Dispatcher',
      filePath: 'packages/react-reconciler/src/ReactFiberHooks.js',
      functionSummary: 'Manages state object linked lists and dispatches useState and useReducer update queues.',
      whyBuilt: 'Hooks require precise call-order memory without component class instances. This file binds hook state directly to Fiber node update queues.',
      maintainers: [
        { name: 'Dan Abramov', initials: 'DA', share: 65 },
        { name: 'Sophie Alpert', initials: 'SA', share: 35 },
      ],
      commits: [
        {
          hash: '#f491c0a',
          date: '2019-10-25',
          message: 'Optimize dispatcher resolution speed during update phase',
          author: 'Dan Abramov',
        },
        {
          hash: '#b820a41',
          date: '2020-01-14',
          message: 'Add warning for conditional hook dispatchers',
          author: 'Sophie Alpert',
        },
      ],
      codeLines: [
        { num: 1, code: 'function mountState<S>(initialState: S) {', blame: 'Dan Abramov, 2019 (#f491c0a)' },
        { num: 2, code: '  const hook = mountWorkInProgressHook();', blame: 'Dan Abramov, 2019 (#f491c0a)' },
        { num: 3, code: '  hook.memoizedState = initialState;', blame: 'Sophie Alpert, 2020 (#b820a41)' },
        { num: 4, code: '  const queue = { pending: null, dispatch: null };', blame: 'Dan Abramov, 2019 (#f491c0a)' },
        { num: 5, code: '  return [hook.memoizedState, dispatchSetState];', blame: 'Sophie Alpert, 2020 (#b820a41)' },
        { num: 6, code: '}', blame: 'Dan Abramov, 2019 (#f491c0a)' },
      ],
      audioNarration: 'Stop 2 focuses on React Hooks. Every call to useState appends a hook cell onto the current Fiber node’s linked list.',
    },
    {
      stopNumber: 3,
      authorsCount: 1,
      title: 'Synthetic Event System Delegator',
      filePath: 'packages/react-dom/src/events/DOMPluginEventSystem.js',
      functionSummary: 'Normalizes cross-browser native DOM events into React SyntheticEvents using root container delegation.',
      whyBuilt: 'Delegating event listeners to the root container rather than document nodes enables multiple React roots to coexist safely on the same page.',
      maintainers: [
        { name: 'Dominic Gannaway', initials: 'DG', share: 100 },
      ],
      commits: [
        {
          hash: '#c99021a',
          date: '2020-07-08',
          message: 'Delegate all native events directly to root container',
          author: 'Dominic Gannaway',
        },
      ],
      codeLines: [
        { num: 1, code: 'export function listenToAllSupportedEvents(rootContainerElement) {', blame: 'Dominic Gannaway, 2020 (#c99021a)' },
        { num: 2, code: '  allNativeEvents.forEach(domEventName => {', blame: 'Dominic Gannaway, 2020 (#c99021a)' },
        { num: 3, code: '    listenToNativeEvent(domEventName, false, rootContainerElement);', blame: 'Dominic Gannaway, 2020 (#c99021a)' },
        { num: 4, code: '  });', blame: 'Dominic Gannaway, 2020 (#c99021a)' },
        { num: 5, code: '}', blame: 'Dominic Gannaway, 2020 (#c99021a)' },
      ],
      audioNarration: 'Stop 3 explains Synthetic Events. React listens for native events at the root boundary and dispatches them efficiently across component trees.',
    },
  ];

  const currentStop = tourData[activeStop];
  const totalStops = tourData.length;

  const handleNextStop = () => {
    if (activeStop < totalStops - 1) {
      setActiveStop(prev => prev + 1);
    }
  };

  const handlePrevStop = () => {
    if (activeStop > 0) {
      setActiveStop(prev => prev - 1);
    }
  };

  return (
    <section 
      ref={sectionRef}
      id="demo" 
      className={`w-full py-12 md:py-20 px-4 sm:px-6 relative transition-colors duration-300 ${
        isDark ? 'bg-[#09090b] text-slate-100' : 'bg-white text-slate-900'
      }`}
    >
      <div className="max-w-7xl mx-auto flex flex-col gap-6">

        {/* 1. TOP HEADER CONTROL CARD */}
        <div className={`rounded-3xl p-5 md:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border transition-colors ${
          isDark ? 'bg-[#12121a] border-slate-800 shadow-xl' : 'bg-white border-black shadow-xs'
        }`}>
          <div>
            <div className="flex items-center gap-2.5 flex-wrap mb-1">
              <h2 className={`text-xl md:text-2xl font-black tracking-tight ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}>
                Interactive Codebase Tour
              </h2>
              <span className={`font-mono text-xs font-semibold px-3 py-1 rounded-full border ${
                isDark 
                  ? 'bg-purple-950/80 text-purple-300 border-purple-800' 
                  : 'bg-purple-100 text-purple-700 border-purple-300'
              }`}>
                facebook/react
              </span>
            </div>
            <p className={`text-xs sm:text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Select tour stops on the left to step through narrated architectural modules.
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap w-full md:w-auto justify-start md:justify-end">
            <select
              value={selectedRepo}
              onChange={(e) => setSelectedRepo(e.target.value)}
              className={`rounded-xl px-3 py-2 text-xs md:text-sm font-medium outline-none cursor-pointer border ${
                isDark 
                  ? 'bg-[#1a1a26] border-slate-700 text-slate-200' 
                  : 'bg-white border-black text-slate-800'
              }`}
            >
              <option>facebook/react (React Fiber Tour)</option>
              <option>vercel/next.js (App Router Tour)</option>
              <option>supabase/supabase (Auth Engine Tour)</option>
            </select>

            <div className={`flex items-center p-1 rounded-xl border ${
              isDark ? 'bg-[#090910] border-slate-700' : 'bg-slate-100 border-black'
            }`}>
              {['New Dev', 'Refactor', 'Arch 101'].map((mode) => (
                <button
                  key={mode}
                  onClick={() => setPresetFilter(mode)}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                    presetFilter === mode
                      ? 'bg-purple-600 text-white shadow-xs'
                      : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* MAIN TWO-COLUMN DEMO WORKSPACE */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

          {/* LEFT SIDEBAR (4 Cols) */}
          <div className="lg:col-span-4 flex flex-col gap-6">

            {/* Git Ingestion Analytics Card */}
            <div className={`rounded-3xl p-5 border transition-colors ${
              isDark ? 'bg-[#12121a] border-slate-800 shadow-xl' : 'bg-white border-black shadow-xs'
            }`}>
              <div className={`flex items-center justify-between pb-4 mb-4 border-b ${
                isDark ? 'border-slate-800' : 'border-slate-200'
              }`}>
                <div className={`flex items-center gap-2 text-xs font-bold uppercase tracking-wider ${
                  isDark ? 'text-slate-300' : 'text-slate-700'
                }`}>
                  <BarChart3 className="w-4 h-4 text-purple-500" />
                  <span>GIT INGESTION ANALYTICS</span>
                </div>
                <span className={`font-mono text-xs px-2 py-0.5 rounded border ${
                  isDark ? 'bg-[#1a1a26] text-slate-400 border-slate-700' : 'bg-slate-100 text-slate-500 border-slate-300'
                }`}>
                  main
                </span>
              </div>

              {/* 2x2 Analytics Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className={`rounded-2xl p-3.5 text-center border ${
                  isDark ? 'bg-[#1a1a26] border-slate-700' : 'bg-white border-black'
                }`}>
                  <div className={`text-[11px] font-medium mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Commits Extracted</div>
                  <div className={`text-lg font-black font-mono ${isDark ? 'text-white' : 'text-slate-900'}`}>4,821</div>
                </div>

                <div className={`rounded-2xl p-3.5 text-center border ${
                  isDark ? 'bg-[#1a1a26] border-slate-700' : 'bg-white border-black'
                }`}>
                  <div className={`text-[11px] font-medium mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>File Churn Index</div>
                  <div className="text-sm font-bold text-amber-500">High (88/100)</div>
                </div>

                <div className={`rounded-2xl p-3.5 text-center border ${
                  isDark ? 'bg-[#1a1a26] border-slate-700' : 'bg-white border-black'
                }`}>
                  <div className={`text-[11px] font-medium mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Contributors</div>
                  <div className={`text-lg font-black font-mono ${isDark ? 'text-white' : 'text-slate-900'}`}>142</div>
                </div>

                <div className={`rounded-2xl p-3.5 text-center border ${
                  isDark ? 'bg-[#1a1a26] border-slate-700' : 'bg-white border-black'
                }`}>
                  <div className={`text-[11px] font-medium mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Vague Flagged</div>
                  <div className="text-sm font-bold text-rose-500">14 Low-Conf</div>
                </div>
              </div>
            </div>

            {/* Tour Route Stops Card */}
            <div className={`rounded-3xl p-5 border transition-colors ${
              isDark ? 'bg-[#12121a] border-slate-800 shadow-xl' : 'bg-white border-black shadow-xs'
            }`}>
              <div className="flex items-center justify-between pb-3 mb-4">
                <div className={`flex items-center gap-2 text-xs font-bold uppercase tracking-wider ${
                  isDark ? 'text-slate-300' : 'text-slate-700'
                }`}>
                  <BookOpen className="w-4 h-4 text-purple-500" />
                  <span>TOUR ROUTE STOPS</span>
                </div>
                <span className={`font-semibold text-xs px-2.5 py-0.5 rounded-full border ${
                  isDark 
                    ? 'bg-purple-950/80 text-purple-300 border-purple-800' 
                    : 'bg-purple-100 text-purple-700 border-purple-300'
                }`}>
                  Stop {activeStop + 1} of {tourData.length}
                </span>
              </div>

              {/* Stops List */}
              <div className="flex flex-col gap-3">
                {tourData.map((stop, index) => {
                  const isActive = index === activeStop;
                  return (
                    <button
                      key={stop.stopNumber}
                      onClick={() => setActiveStop(index)}
                      className={`text-left p-4 rounded-2xl transition-all cursor-pointer border ${
                        isActive
                          ? 'border-2 border-purple-500 bg-purple-950/40 shadow-xs'
                          : isDark 
                            ? 'border-slate-800 bg-[#181825] hover:border-slate-700' 
                            : 'border-black bg-white hover:border-purple-500 hover:bg-slate-50/60'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <span className={`font-bold uppercase tracking-wider ${isActive ? 'text-purple-400' : isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                          STOP #{stop.stopNumber}
                        </span>
                        <span className="text-slate-400 font-mono text-[11px]">
                          {stop.authorsCount} authors
                        </span>
                      </div>

                      <div className={`font-bold text-sm mb-1 line-clamp-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        {stop.title}
                      </div>

                      <div className={`font-mono text-xs line-clamp-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        {stop.filePath}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

          {/* RIGHT DISPLAY PANEL (8 Cols) */}
          <div className="lg:col-span-8 flex flex-col gap-6">

            {/* 2. STOP HEADER CARD */}
            <div className={`rounded-3xl p-5 md:p-6 border transition-colors shadow-xs flex items-center justify-between gap-4 flex-wrap ${
              isDark ? 'bg-[#12121a] border-slate-800' : 'bg-white border-black'
            }`}>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="bg-black dark:bg-white text-white dark:text-black font-bold text-xs px-2.5 py-0.5 rounded-full shadow-xs">
                    STOP #{currentStop.stopNumber}
                  </span>
                  <h3 className={`text-lg sm:text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {currentStop.title}
                  </h3>
                </div>
                <div className={`flex items-center gap-1.5 text-xs font-mono ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  <FileCode2 className="w-3.5 h-3.5 text-slate-400" />
                  <span>{currentStop.filePath}</span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 ml-auto">
                <button
                  onClick={handlePrevStop}
                  disabled={activeStop === 0}
                  className={`p-2 border rounded-xl disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer ${
                    isDark 
                      ? 'border-slate-700 bg-[#1a1a26] hover:bg-slate-800 text-white' 
                      : 'border-black bg-white hover:bg-slate-100 text-slate-800'
                  }`}
                  aria-label="Previous stop"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={handleNextStop}
                  disabled={activeStop === tourData.length - 1}
                  className={`p-2 border rounded-xl disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer ${
                    isDark 
                      ? 'border-slate-700 bg-[#1a1a26] hover:bg-slate-800 text-white' 
                      : 'border-black bg-white hover:bg-slate-100 text-slate-800'
                  }`}
                  aria-label="Next stop"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* 3. MULTI-TAB PANEL */}
            <div className={`rounded-3xl p-5 md:p-6 border transition-colors shadow-xs flex flex-col gap-6 ${
              isDark ? 'bg-[#12121a] border-slate-800' : 'bg-white border-black'
            }`}>

              {/* Tab Selector Header */}
              <div className={`flex items-center gap-6 border-b pb-3 flex-wrap ${
                isDark ? 'border-slate-800' : 'border-slate-200'
              }`}>
                <button
                  onClick={() => setActiveTab('story')}
                  className={`flex items-center gap-2 text-sm md:text-base font-bold pb-1 cursor-pointer transition-colors border-b-2 ${
                    activeTab === 'story'
                      ? 'border-purple-500 text-purple-400'
                      : isDark ? 'border-transparent text-slate-400 hover:text-white' : 'border-transparent text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <BookOpen className="w-4 h-4" />
                  <span>AI Story & Rationale</span>
                </button>

                <button
                  onClick={() => setActiveTab('code')}
                  className={`flex items-center gap-2 text-sm md:text-base font-bold pb-1 cursor-pointer transition-colors border-b-2 ${
                    activeTab === 'code'
                      ? 'border-purple-500 text-purple-400'
                      : isDark ? 'border-transparent text-slate-400 hover:text-white' : 'border-transparent text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <Code2 className="w-4 h-4" />
                  <span>Code & Live Git Blame</span>
                </button>

                <button
                  onClick={() => setActiveTab('confidence')}
                  className={`flex items-center gap-2 text-sm md:text-base font-bold pb-1 cursor-pointer transition-colors border-b-2 ${
                    activeTab === 'confidence'
                      ? 'border-purple-500 text-purple-400'
                      : isDark ? 'border-transparent text-slate-400 hover:text-white' : 'border-transparent text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>History Confidence</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-semibold border ml-1 ${
                    isDark ? 'bg-amber-950/80 text-amber-300 border-amber-800' : 'bg-amber-100 text-amber-800 border-amber-300'
                  }`}>
                    Flagged
                  </span>
                </button>
              </div>

              {/* TAB 1: AI STORY & RATIONALE */}
              {activeTab === 'story' && (
                <div className="flex flex-col gap-6">

                  {/* Architectural Function Banner */}
                  <div className={`rounded-2xl p-4 md:p-5 border ${
                    isDark ? 'bg-purple-950/40 border-purple-800/40' : 'bg-purple-50/70 border-purple-200/80'
                  }`}>
                    <div className={`text-xs font-bold uppercase tracking-wider mb-1.5 ${isDark ? 'text-purple-300' : 'text-purple-700'}`}>
                      ARCHITECTURAL FUNCTION
                    </div>
                    <div className={`text-sm md:text-base font-semibold leading-relaxed ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {currentStop.functionSummary}
                    </div>
                  </div>

                  {/* Two-Column Mid Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* Why Was It Built This Way? Card */}
                    <div className={`rounded-2xl p-5 flex flex-col gap-3 border ${
                      isDark ? 'bg-[#1a1a26] border-slate-700' : 'bg-white border-black'
                    }`}>
                      <div className={`flex items-center gap-2 font-bold text-base ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        <div className="w-7 h-7 rounded-full bg-purple-100 flex items-center justify-center shrink-0">
                          <HelpCircle className="w-4 h-4 text-purple-600" />
                        </div>
                        <span>Why Was It Built This Way?</span>
                      </div>
                      <p className={`text-sm leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                        {currentStop.whyBuilt}
                      </p>
                    </div>

                    {/* Maintainers & Contributor Overlap Card */}
                    <div className={`rounded-2xl p-5 flex flex-col gap-3 border ${
                      isDark ? 'bg-[#1a1a26] border-slate-700' : 'bg-white border-black'
                    }`}>
                      <div className={`flex items-center gap-2 font-bold text-base mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                          <Users className="w-4 h-4 text-emerald-600" />
                        </div>
                        <span>Maintainers & Contributor Overlap</span>
                      </div>

                      <div className="flex flex-col gap-2.5">
                        {currentStop.maintainers.map((m, idx) => (
                          <div key={idx} className={`flex items-center justify-between text-xs p-2 rounded-xl border ${
                            isDark ? 'bg-[#12121a] border-slate-800' : 'bg-slate-50 border-slate-200'
                          }`}>
                            <div className="flex items-center gap-2">
                              <span className="w-6 h-6 rounded-full bg-purple-600 text-white font-bold flex items-center justify-center text-[10px]">
                                {m.initials}
                              </span>
                              <span className={`font-semibold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{m.name}</span>
                            </div>
                            <span className="font-mono font-bold text-purple-400">{m.share}%</span>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>

                  {/* Key Evolutionary Milestone Commits */}
                  <div className="flex flex-col gap-3">
                    <div className={`flex items-center gap-2 text-xs font-bold uppercase tracking-wider ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      <History className="w-4 h-4 text-purple-500" />
                      <span>KEY EVOLUTIONARY MILESTONE COMMITS</span>
                    </div>

                    <div className="flex flex-col gap-3">
                      {currentStop.commits.map((commit, idx) => (
                        <div key={idx} className={`rounded-2xl p-4 flex flex-col gap-1.5 border ${
                          isDark ? 'bg-[#1a1a26] border-slate-700' : 'bg-white border-black'
                        }`}>
                          <div className="flex items-center justify-between text-xs">
                            <span className={`font-mono font-bold px-2 py-0.5 rounded border ${
                              isDark ? 'bg-purple-950/80 text-purple-300 border-purple-800' : 'bg-purple-50 text-purple-700 border-purple-200'
                            }`}>
                              {commit.hash}
                            </span>
                            <span className="text-slate-400 font-mono text-[11px]">{commit.date}</span>
                          </div>
                          <div className={`font-bold text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            {commit.message}
                          </div>
                          <div className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                            Author: <span className={`font-semibold ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>{commit.author}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              )}

              {/* TAB 2: CODE & LIVE GIT BLAME */}
              {activeTab === 'code' && (
                <div className="bg-slate-950 text-slate-100 rounded-2xl p-4 font-mono text-xs overflow-x-auto border border-black">
                  <div className="text-slate-400 pb-3 mb-3 border-b border-slate-800 flex justify-between">
                    <span>// {currentStop.filePath}</span>
                    <span className="text-purple-400">Hover lines for live git blame data</span>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    {currentStop.codeLines.map((line) => (
                      <div key={line.num} className="flex items-center justify-between hover:bg-slate-900 p-1.5 rounded group">
                        <div className="flex gap-4">
                          <span className="text-slate-600 select-none w-4">{line.num}</span>
                          <span className="text-slate-200">{line.code}</span>
                        </div>
                        <span className="text-purple-400 opacity-60 group-hover:opacity-100 transition-opacity text-[11px] pl-4">
                          {line.blame}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: HISTORY CONFIDENCE */}
              {activeTab === 'confidence' && (
                <div className={`border rounded-2xl p-5 flex flex-col gap-4 ${
                  isDark ? 'bg-amber-950/40 border-amber-800/40' : 'bg-amber-50/60 border-amber-200'
                }`}>
                  <div className="flex items-center gap-2 text-amber-500 font-bold text-base">
                    <CheckCircle2 className="w-5 h-5" />
                    <span>History Confidence Analysis & PR Metadata Repairs</span>
                  </div>
                  <p className={`text-sm leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    Onboarding Ghost detected 3 commits with vague messages in this module (e.g. "fix stuff"). The analysis layer repaired the context by extracting linked PR #4821 title, discussion notes, and test coverage diffs.
                  </p>
                  <div className={`rounded-xl p-3.5 text-xs font-mono border ${
                    isDark ? 'bg-[#12121a] border-amber-800 text-amber-300' : 'bg-white border-amber-300 text-slate-800'
                  }`}>
                    [CONFIDENCE SCORE]: 94/100 (Repaired via GitHub Pull Request #4821 metadata)
                  </div>
                </div>
              )}

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
