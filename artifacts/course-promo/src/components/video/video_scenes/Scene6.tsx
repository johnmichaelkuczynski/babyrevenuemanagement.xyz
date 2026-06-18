import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export function Scene6() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 500),
      setTimeout(() => setPhase(2), 1500), // Grade badge appears
      setTimeout(() => setPhase(3), 2800), // Rationale slides in
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div 
      className="absolute inset-0 flex bg-slate-900"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      <motion.div 
        className="w-[85vw] h-[80vh] m-auto bg-slate-800 rounded-xl shadow-2xl flex overflow-hidden border border-slate-700"
      >
        <div className="flex-1 p-12 relative flex flex-col">
          
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-white">Unit 1 Assignment</h2>
            <motion.div 
              className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-6 py-2 rounded-full font-bold text-xl flex items-center gap-2"
              initial={{ scale: 0, opacity: 0 }}
              animate={phase >= 2 ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
              transition={{ type: 'spring', bounce: 0.5 }}
            >
              <span>92%</span>
            </motion.div>
          </div>

          <div className="flex-1 bg-slate-900/50 rounded-xl p-8 border border-slate-700/50 relative">
            <div className="mb-4">
              <span className="text-slate-400 font-medium text-sm">Question 3</span>
              <p className="text-slate-200 mt-2">Why can a warehouse be packed full yet still ship orders late?</p>
            </div>
            
            <div className="bg-slate-800 p-4 rounded-lg text-slate-300 border border-slate-700 font-serif italic mb-6">
              "Because 'full' isn't the same as 'flowing.' If things pile up at one slow step, orders sit waiting even though the shelves are stuffed — being full can actually mean the work is stuck, not moving."
            </div>

            <motion.div 
              className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-5 flex gap-4"
              initial={{ opacity: 0, x: -20 }}
              animate={phase >= 3 ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
            >
              <div className="w-8 h-8 rounded-full bg-blue-500/20 flex flex-shrink-0 items-center justify-center text-blue-400">📝</div>
              <div>
                <h4 className="text-blue-400 font-bold mb-1">Feedback</h4>
                <p className="text-blue-100/80 leading-relaxed text-sm">
                  Full credit — you separated "full" from "flowing," gave a clear reason a stocked warehouse can still ship late (work piling up at a slow step), and explained why smooth flow matters more than how full it looks.
                </p>
              </div>
            </motion.div>
          </div>

        </div>
      </motion.div>
    </motion.div>
  );
}
