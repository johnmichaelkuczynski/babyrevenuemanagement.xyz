import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export function Scene5() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 500),
      setTimeout(() => setPhase(2), 2500), // Select answer
      setTimeout(() => setPhase(3), 4000), // Correct + difficulty goes up
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
        className="w-[90vw] h-[85vh] bg-white rounded-2xl shadow-elevated flex flex-col overflow-hidden border border-slate-200"
      >
        <div className="h-16 border-b border-slate-200 flex items-center px-8 justify-between bg-white z-20">
          <div className="font-medium text-slate-900 flex items-center gap-2">
            <span className="text-slate-400">Practice</span> / 1.2 Willingness to Pay
          </div>
          
          <motion.div 
            className="flex items-center gap-4 bg-slate-50 px-4 py-1.5 rounded-full border border-slate-200"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <span className="text-sm font-semibold text-slate-500">DIFFICULTY</span>
            <div className="flex gap-1">
              <div className="w-8 h-2 bg-primary rounded-sm" />
              <div className="w-8 h-2 bg-primary rounded-sm" />
              <motion.div 
                className="w-8 h-2 rounded-sm"
                animate={{ backgroundColor: phase >= 3 ? '#4f46e5' : '#e2e8f0' }}
                transition={{ duration: 0.4 }}
              />
              <div className="w-8 h-2 bg-slate-200 rounded-sm" />
            </div>
            {phase >= 3 && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.5 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className="text-primary font-bold ml-1 leading-none"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 11l7-7 7 7M12 4v16" /></svg>
              </motion.div>
            )}
          </motion.div>
        </div>

        <div className="flex-1 bg-slate-50 p-12 flex items-center justify-center relative">
          <motion.div 
            className="w-full max-w-2xl bg-white p-10 rounded-2xl shadow-card border border-slate-200"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="text-sm font-bold text-primary tracking-widest uppercase">Question 3 of 5</div>
              <div className="flex items-center gap-1 text-orange-500">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2c.5 3-1.5 4.5-3 6.5C7 11 6 13 7 15a5 5 0 0010 0c0-2-1-3.5-2.5-5 .5 1.5 0 2.5-1 3 .5-2-1-4-1.5-6.5z" /></svg>
                <span className="font-bold">2 Streak</span>
              </div>
            </div>

            <h3 className="text-2xl font-bold text-slate-900 mb-8 leading-snug">
              A shop owner sets one price for a hoodie and is thrilled that almost everyone who looks at it buys it instantly. Why might this actually be a problem?
            </h3>

            <div className="space-y-4">
              <motion.div 
                className="p-5 border-2 border-slate-200 rounded-xl text-slate-600 bg-white"
                animate={phase >= 2 ? { opacity: 0.5, borderColor: '#e2e8f0' } : {}}
              >
                The hoodies are priced too high, so the owner should lower the price.
              </motion.div>
              
              <motion.div 
                className="p-5 border-2 rounded-xl text-slate-900 relative overflow-hidden"
                animate={
                  phase === 1 ? { borderColor: '#e2e8f0', backgroundColor: '#ffffff' } :
                  phase === 2 ? { borderColor: '#4f46e5', backgroundColor: '#eef2ff' } :
                  { borderColor: '#10b981', backgroundColor: '#ecfdf5' }
                }
              >
                <div className="font-medium text-lg">
                  If nearly everyone buys instantly, the price is likely below many buyers' willingness to pay — the owner is leaving money on the table and could charge more.
                </div>
                
                <motion.div 
                  className="mt-4 pt-4 border-t border-emerald-200/50 text-emerald-800 text-sm flex items-start gap-3"
                  initial={{ height: 0, opacity: 0 }}
                  animate={phase >= 3 ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 }}
                >
                  <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 mt-0.5"><svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg></div>
                  <p><strong>Correct!</strong> Instant, easy sales signal the price sits below buyers' hidden ceilings. The owner is giving away surplus and has room to raise the price.</p>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}