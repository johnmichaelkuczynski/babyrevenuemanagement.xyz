import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export function Scene7() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 500),
      setTimeout(() => setPhase(2), 2000), // Layer 1 scan
      setTimeout(() => setPhase(3), 4000), // Layer 2 scan
      setTimeout(() => setPhase(4), 5500), // Verdict
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div 
      className="absolute inset-0 flex items-center justify-center bg-slate-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, x: '-10vw' }}
      transition={{ duration: 0.8 }}
    >
      <motion.div 
        className="w-[90vw] h-[85vh] bg-white rounded-2xl shadow-elevated flex overflow-hidden border border-slate-200"
      >
        <div className="w-1/3 bg-slate-900 p-12 text-white flex flex-col justify-center border-r border-slate-800">
          <div className="w-16 h-16 bg-primary/20 text-primary rounded-2xl flex items-center justify-center mb-8 border border-primary/30">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 22S19 18 19 12V5L12 2L5 5V12C5 18 12 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h2 className="text-4xl font-display font-bold mb-4">Integrity Scan</h2>
          <p className="text-slate-400 text-lg leading-relaxed">
            Two-layer AI-authorship detection checks every submission to ensure the work is actually theirs.
          </p>
        </div>

        <div className="flex-1 p-16 flex flex-col justify-center bg-slate-50">
          <div className="max-w-2xl w-full mx-auto space-y-6">
            
            {/* Layer 1: GPTZero */}
            <motion.div 
              className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between"
              initial={{ opacity: 0, x: 20 }}
              animate={phase >= 2 ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 font-bold">1</div>
                <div>
                  <h4 className="text-slate-900 font-bold text-lg">Static Text Classifier</h4>
                  <p className="text-slate-500 text-sm">GPTZero API • Semantic pattern analysis</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-emerald-600 font-bold text-xl">2% AI</div>
                <div className="text-slate-400 text-xs uppercase tracking-wide font-semibold mt-1">Human Written</div>
              </div>
            </motion.div>

            {/* Layer 2: Keystroke */}
            <motion.div 
              className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between"
              initial={{ opacity: 0, x: 20 }}
              animate={phase >= 3 ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 font-bold">2</div>
                <div>
                  <h4 className="text-slate-900 font-bold text-lg">Diachronic Keystroke Trace</h4>
                  <p className="text-slate-500 text-sm">Behavioral pacing & bulk paste detection</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-emerald-600 font-bold text-xl">Valid</div>
                <div className="text-slate-400 text-xs uppercase tracking-wide font-semibold mt-1">Steady pace</div>
              </div>
            </motion.div>

            {/* Verdict */}
            <motion.div 
              className="mt-12 bg-emerald-50 border border-emerald-200 p-8 rounded-2xl flex items-center gap-6"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={phase >= 4 ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", bounce: 0.4 }}
            >
              <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div>
                <div className="text-emerald-800 text-sm font-bold uppercase tracking-wider mb-1">Final Verdict</div>
                <div className="text-emerald-600 text-3xl font-display font-bold">Authentic Work</div>
              </div>
            </motion.div>

          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}