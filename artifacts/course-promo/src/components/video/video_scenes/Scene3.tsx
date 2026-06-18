import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export function Scene3() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 500),
      setTimeout(() => setPhase(2), 2000), // Show toggle
      setTimeout(() => setPhase(3), 3500), // Toggle to Medium
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div 
      className="absolute inset-0 flex bg-slate-100"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <motion.div 
        className="w-[85vw] h-[80vh] m-auto bg-white rounded-xl shadow-soft flex overflow-hidden border border-slate-200"
      >
        {/* Sidebar - static */}
        <div className="w-[30vw] bg-slate-50 border-r border-slate-200 p-8 flex flex-col opacity-50">
          <div className="w-12 h-12 bg-blue-600 rounded-lg mb-8" />
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Unit 1</h3>
          <div className="text-sm font-medium text-slate-400 mb-4">1.1 What operations & supply chain analytics is</div>
          <div className="text-sm font-medium text-slate-400 mb-4">1.2 Inventory</div>
          <div className="text-sm font-medium text-slate-400 mb-4">1.3 The bullwhip effect</div>
          <div className="text-sm font-medium text-blue-600 bg-blue-50 p-2 rounded -ml-2 mb-4">1.4 Bottlenecks</div>
        </div>

        {/* Content Pane */}
        <div className="flex-1 p-16 relative">
          
          <motion.div
            className="absolute top-8 right-16 flex bg-slate-100 rounded-full p-1"
            initial={{ opacity: 0, y: -20 }}
            animate={phase >= 2 ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
          >
            <div className="px-4 py-1 text-sm font-medium text-slate-500 rounded-full">Short</div>
            <motion.div 
              className="px-4 py-1 text-sm font-medium text-blue-600 bg-white shadow-sm rounded-full"
              initial={{ x: -60, opacity: 0 }}
              animate={phase >= 3 ? { x: 0, opacity: 1 } : { x: -60, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            >
              Medium
            </motion.div>
            <div className="px-4 py-1 text-sm font-medium text-slate-500 rounded-full">Long</div>
          </motion.div>

          <motion.div
            className="mt-16 max-w-2xl"
            initial={{ opacity: 0 }}
            animate={phase >= 1 ? { opacity: 1 } : { opacity: 0 }}
          >
            <h1 className="text-4xl font-bold text-slate-900 mb-8">Bottlenecks</h1>
            
            <p className="text-xl leading-relaxed text-slate-700 mb-6">
              A bottleneck is the slowest step in a process — and the whole system can only move as fast as that one step.
            </p>
            
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={phase >= 3 ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <p className="text-xl leading-relaxed text-slate-700 bg-blue-50/50 p-4 rounded-lg border border-blue-100">
                It quietly answers the most important question on any line: where is work piling up, and which single step should we fix first?
              </p>
            </motion.div>
          </motion.div>

        </div>
      </motion.div>
    </motion.div>
  );
}
