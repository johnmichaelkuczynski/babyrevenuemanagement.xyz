import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export function Scene2() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 500),
      setTimeout(() => setPhase(2), 1500),
      setTimeout(() => setPhase(3), 2500),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  const topics = [
    { title: "What Operations & Supply Chain Analytics Is", status: "completed" },
    { title: "Inventory", status: "completed" },
    { title: "The Bullwhip Effect", status: "completed" },
    { title: "Bottlenecks", status: "active" },
    { title: "Waiting Lines", status: "locked" },
    { title: "Demand Forecasting", status: "locked" },
    { title: "Routing & Optimization", status: "locked" },
    { title: "Resilience", status: "locked" },
  ];

  return (
    <motion.div 
      className="absolute inset-0 flex items-center justify-center bg-slate-50"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, x: '-10vw' }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <motion.div 
        className="w-[90vw] h-[85vh] bg-white rounded-2xl shadow-elevated flex overflow-hidden border border-slate-200"
      >
        {/* App Sidebar */}
        <div className="w-64 bg-slate-50 border-r border-slate-200 flex flex-col">
          <div className="p-6 flex items-center gap-3 border-b border-slate-200">
            <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="font-display font-bold text-slate-900">OSCA</span>
          </div>
          <div className="p-4 flex-1 space-y-1">
            <div className="px-3 py-2 bg-slate-200/50 rounded-lg text-sm font-medium text-slate-900 flex items-center gap-2">
              <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
              Dashboard
            </div>
            <div className="px-3 py-2 text-sm font-medium text-slate-500 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
              Analytics
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="flex-1 overflow-hidden flex flex-col bg-slate-50">
          <div className="p-8 pb-4">
            <h1 className="text-3xl font-display font-bold text-slate-900">Your Progress</h1>
            <p className="text-slate-500 mt-1">Unit 1: The Foundations of Flow</p>
          </div>

          <div className="p-8 pt-0 flex-1 grid grid-cols-2 gap-6 items-start">
            <motion.div className="col-span-1 space-y-3"
              initial={{ y: 20, opacity: 0 }}
              animate={phase >= 1 ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
            >
              {topics.map((topic, i) => (
                <motion.div 
                  key={i}
                  className={`p-4 rounded-xl flex items-center gap-4 ${topic.status === 'active' ? 'bg-primary text-white shadow-md' : topic.status === 'completed' ? 'bg-white border border-slate-200' : 'bg-white border border-slate-200 opacity-60'}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={phase >= 2 ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                  transition={{ delay: phase >= 2 ? i * 0.05 : 0 }}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${topic.status === 'active' ? 'bg-white/20' : topic.status === 'completed' ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-400'}`}>
                    {topic.status === 'completed' ? '✓' : topic.status === 'active' ? '▶' : '🔒'}
                  </div>
                  <div className="flex-1 font-medium">1.{i+1} {topic.title}</div>
                </motion.div>
              ))}
            </motion.div>

            <motion.div className="col-span-1"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={phase >= 3 ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
            >
              <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                <div className="w-16 h-16 bg-blue-100 text-primary rounded-full flex items-center justify-center text-2xl mb-4">🏆</div>
                <h2 className="text-2xl font-bold font-display text-slate-900 mb-2">Real Concepts.</h2>
                <h2 className="text-2xl font-bold font-display text-slate-400 mb-4">No Jargon.</h2>
                <p className="text-slate-600 leading-relaxed">
                  The curriculum covers exactly what you need to know about how things move through a business, taught in plain, accessible language.
                </p>
                <div className="mt-8 flex items-center gap-4 text-sm font-medium text-slate-500">
                  <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-green-500"></div> 3 Topics Complete</div>
                  <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-primary"></div> 1 Topic Active</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}