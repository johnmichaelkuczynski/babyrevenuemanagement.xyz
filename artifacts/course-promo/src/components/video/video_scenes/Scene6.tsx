import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export function Scene6() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 500),
      setTimeout(() => setPhase(2), 2000), // Grade badge pops
      setTimeout(() => setPhase(3), 3500), // Feedback slides in
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div 
      className="absolute inset-0 flex items-center justify-center bg-slate-900"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, x: '-10vw' }}
      transition={{ duration: 0.8 }}
    >
      <motion.div 
        className="w-[90vw] h-[85vh] bg-slate-800 rounded-2xl shadow-elevated flex flex-col overflow-hidden border border-slate-700"
      >
        <div className="h-20 border-b border-slate-700 flex items-center px-10 justify-between bg-slate-800/80 backdrop-blur z-20">
          <div>
            <h2 className="text-2xl font-bold font-display text-white">Unit 1 Assessment</h2>
            <p className="text-slate-400 text-sm">Graded by AI</p>
          </div>
          
          <motion.div 
            className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-6 py-2 rounded-full font-bold text-2xl flex items-center gap-2"
            initial={{ scale: 0, opacity: 0 }}
            animate={phase >= 2 ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
            transition={{ type: 'spring', bounce: 0.6, damping: 15 }}
          >
            94%
          </motion.div>
        </div>

        <div className="flex-1 bg-slate-900/50 p-12 overflow-y-auto">
          <div className="max-w-4xl mx-auto space-y-8">
            
            <motion.div 
              className="bg-slate-800 rounded-xl p-8 border border-slate-700"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <div className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Question 4</div>
                  <h3 className="text-xl text-white font-medium">Why can a warehouse be packed full yet still ship orders late?</h3>
                </div>
                <div className="bg-slate-700 text-slate-300 px-3 py-1 rounded font-medium text-sm">10 / 10 pts</div>
              </div>

              <div className="bg-slate-900/80 p-6 rounded-lg text-slate-300 font-serif italic mb-6 border border-slate-700/50 text-lg">
                "Because 'full' isn't the same as 'flowing.' If things pile up at one slow step, orders sit waiting even though the shelves are stuffed. Being full can actually mean the work is stuck, not moving."
              </div>

              <motion.div 
                className="bg-blue-900/20 border border-blue-500/30 rounded-xl p-6 flex gap-4 mt-6"
                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                animate={phase >= 3 ? { opacity: 1, height: 'auto', marginTop: '1.5rem' } : { opacity: 0, height: 0, marginTop: 0 }}
              >
                <div className="w-10 h-10 rounded-full bg-blue-500/20 flex flex-shrink-0 items-center justify-center text-blue-400"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l1.8 5.2L19 9l-5.2 1.8L12 16l-1.8-5.2L5 9l5.2-1.8z" /></svg></div>
                <div>
                  <h4 className="text-blue-400 font-bold mb-2">AI Feedback</h4>
                  <p className="text-blue-100/80 leading-relaxed">
                    Full credit. You correctly separated the concept of "full" (inventory volume) from "flowing" (throughput). You clearly explained that a stocked warehouse can still ship late if work piles up at a bottleneck, proving that smooth flow matters more than raw capacity. Excellent answer.
                  </p>
                </div>
              </motion.div>
            </motion.div>
            
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}