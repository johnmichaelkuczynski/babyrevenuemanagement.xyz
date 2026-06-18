import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export function Scene3() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 500),
      setTimeout(() => setPhase(2), 2000), // Toggle to Medium
      setTimeout(() => setPhase(3), 3500), // Toggle to Long
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div 
      className="absolute inset-0 flex items-center justify-center bg-slate-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, x: '-10vw' }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <motion.div 
        className="w-[90vw] h-[85vh] bg-white rounded-2xl shadow-elevated flex flex-col overflow-hidden border border-slate-200"
      >
        <div className="h-16 border-b border-slate-200 flex items-center px-8 justify-between bg-white z-20">
          <div className="font-medium text-slate-500">1.4 Bottlenecks</div>
          
          {/* Depth Toggle */}
          <motion.div
            className="flex bg-slate-100 rounded-full p-1 border border-slate-200"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className={`px-4 py-1.5 text-sm font-medium rounded-full transition-colors ${phase === 1 ? 'bg-white shadow text-slate-900' : 'text-slate-500'}`}>Short</div>
            <div className={`px-4 py-1.5 text-sm font-medium rounded-full transition-colors ${phase === 2 ? 'bg-white shadow text-primary' : 'text-slate-500'}`}>Medium</div>
            <div className={`px-4 py-1.5 text-sm font-medium rounded-full transition-colors ${phase === 3 ? 'bg-white shadow text-primary' : 'text-slate-500'}`}>Long</div>
          </motion.div>
        </div>

        <div className="flex-1 overflow-hidden relative">
          <div className="absolute inset-0 p-16 overflow-y-auto bg-slate-50">
            <div className="max-w-3xl mx-auto">
              <h1 className="text-4xl font-display font-bold text-slate-900 mb-8">Bottlenecks</h1>
              
              {/* Short Version */}
              <motion.div
                className="absolute w-full max-w-3xl"
                initial={false}
                animate={{ opacity: phase === 1 ? 1 : 0, pointerEvents: phase === 1 ? 'auto' : 'none' }}
              >
                <p className="text-2xl leading-relaxed text-slate-700">
                  A bottleneck is the slowest step in a process. The whole system can only move as fast as that one step.
                </p>
              </motion.div>

              {/* Medium Version */}
              <motion.div
                className="absolute w-full max-w-3xl"
                initial={false}
                animate={{ opacity: phase === 2 ? 1 : 0, pointerEvents: phase === 2 ? 'auto' : 'none' }}
              >
                <p className="text-xl leading-relaxed text-slate-700 mb-6">
                  A bottleneck is the slowest step in a process. Imagine a garden hose that is pinched in the middle. It doesn't matter how wide the hose is before or after the pinch; the water can only flow as fast as the pinched part allows.
                </p>
                <p className="text-xl leading-relaxed text-slate-700">
                  In a business, the whole system can only move as fast as its slowest step. If you want to speed things up, you must fix the bottleneck first. Fixing any other step won't help.
                </p>
              </motion.div>

              {/* Long Version */}
              <motion.div
                className="absolute w-full max-w-3xl"
                initial={false}
                animate={{ opacity: phase === 3 ? 1 : 0, pointerEvents: phase === 3 ? 'auto' : 'none' }}
              >
                <p className="text-lg leading-relaxed text-slate-700 mb-4">
                  A bottleneck is the slowest step in a process. Imagine a garden hose that is pinched in the middle. It doesn't matter how wide the hose is before or after the pinch; the water can only flow as fast as the pinched part allows.
                </p>
                <p className="text-lg leading-relaxed text-slate-700 mb-4">
                  This concept was popularized by Eliyahu M. Goldratt in his book <em>The Goal</em>. He called it the "Theory of Constraints." Every system has at least one constraint (or bottleneck).
                </p>
                <p className="text-lg leading-relaxed text-slate-700 mb-4">
                  In a business, the whole system can only move as fast as its slowest step. If you want to speed things up, you must fix the bottleneck first. Fixing any other step — say, making the fastest step even faster — is a waste of time and money, because the work will just pile up in front of the bottleneck.
                </p>
                <div className="p-6 bg-white border border-slate-200 rounded-xl mt-6 shadow-sm">
                  <h4 className="font-bold text-slate-900 mb-2">Example: The Car Wash</h4>
                  <p className="text-slate-600">A car wash can vacuum 20 cars an hour, but the drying station can only dry 10 cars an hour. The drying station is the bottleneck. The car wash can only finish 10 cars per hour total.</p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}