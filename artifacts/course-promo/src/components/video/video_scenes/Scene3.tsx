import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export function Scene3() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 500),
      setTimeout(() => setPhase(2), 1500), // Toggle to Medium
      setTimeout(() => setPhase(3), 2500), // Toggle to Long
      setTimeout(() => setPhase(4), 3500), // Toggle to Yours
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
        className="w-[80vw] h-[80vh] bg-white rounded-xl shadow-sm flex flex-col overflow-hidden border border-slate-200"
      >
        <div className="h-14 border-b border-slate-200 flex items-center px-6 justify-between bg-white z-20">
          <div className="font-display font-bold text-xl text-[hsl(222,47%,11.2%)]">1.3 Price Elasticity</div>
          
          {/* Depth Toggle */}
          <motion.div
            className="flex bg-white rounded-md p-1 border border-slate-200 shadow-sm"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className={`px-3 py-1 text-xs font-medium rounded transition-colors uppercase tracking-wider ${phase === 1 ? 'bg-[hsl(222,47%,11.2%)] text-white' : 'text-slate-500'}`}>Short</div>
            <div className={`px-3 py-1 text-xs font-medium rounded transition-colors uppercase tracking-wider ${phase === 2 ? 'bg-[hsl(222,47%,11.2%)] text-white' : 'text-slate-500'}`}>Medium</div>
            <div className={`px-3 py-1 text-xs font-medium rounded transition-colors uppercase tracking-wider ${phase === 3 ? 'bg-[hsl(222,47%,11.2%)] text-white' : 'text-slate-500'}`}>Long</div>
            <div className={`px-3 py-1 text-xs font-medium rounded transition-colors uppercase tracking-wider flex items-center gap-1 ${phase === 4 ? 'bg-[hsl(222,47%,11.2%)] text-white' : 'text-slate-500'}`}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.2 1.2 0 0 0 1.72 0L21.64 5.36a1.21 1.21 0 0 0 0-1.72Z"/><path d="m14 7 3 3"/><path d="M5 6v4"/><path d="M19 14v4"/><path d="M10 2v2"/><path d="M7 8H3"/><path d="M21 16h-4"/><path d="M11 3H9"/></svg>
              Yours
            </div>
          </motion.div>
        </div>

        <div className="flex-1 overflow-hidden relative">
          <div className="absolute inset-0 p-12 overflow-y-auto bg-white">
            <div className="max-w-2xl mx-auto">
              
              {/* Short Version */}
              <motion.div
                className="absolute w-full max-w-2xl"
                initial={false}
                animate={{ opacity: phase === 1 ? 1 : 0, pointerEvents: phase === 1 ? 'auto' : 'none' }}
              >
                <p className="text-xl leading-relaxed text-slate-700">
                  Price elasticity is how much demand changes when you change the price. If a small rise sends customers running, demand is elastic; if they barely react, it's inelastic.
                </p>
              </motion.div>

              {/* Medium Version */}
              <motion.div
                className="absolute w-full max-w-2xl"
                initial={false}
                animate={{ opacity: phase === 2 ? 1 : 0, pointerEvents: phase === 2 ? 'auto' : 'none' }}
              >
                <p className="text-lg leading-relaxed text-slate-700 mb-6">
                  Price elasticity measures how sensitive buyers are to a change in price. Imagine a coffee shop with three rivals next door raising its price — many customers simply walk to a cheaper rival. That's elastic demand: bendy and quick to react.
                </p>
                <p className="text-lg leading-relaxed text-slate-700">
                  Now picture the only pharmacy in town raising the price of a prescription. Customers grumble but still pay, because there's nowhere else to go. That's inelastic demand. Whether a price rise earns more or backfires depends entirely on which one you're facing.
                </p>
              </motion.div>

              {/* Long Version */}
              <motion.div
                className="absolute w-full max-w-2xl"
                initial={false}
                animate={{ opacity: phase === 3 ? 1 : 0, pointerEvents: phase === 3 ? 'auto' : 'none' }}
              >
                <p className="text-base leading-relaxed text-slate-700 mb-4">
                  Price elasticity measures how sensitive buyers are to a change in price. Imagine a coffee shop with three rivals next door raising its price — many customers simply walk to a cheaper rival. That's elastic demand: bendy and quick to react.
                </p>
                <p className="text-base leading-relaxed text-slate-700 mb-4">
                  Economists put a number on this, the price elasticity of demand: roughly, the percentage change in how much people buy divided by the percentage change in price. When that number is large, demand is elastic; when it's small, demand is inelastic.
                </p>
                <p className="text-base leading-relaxed text-slate-700 mb-4">
                  Whether a price rise earns more or backfires depends entirely on which one you're facing. Raising prices on inelastic goods (few substitutes) usually earns more; raising prices on elastic goods (easy substitutes) can drive customers away and lose money.
                </p>
              </motion.div>

              {/* Yours Version */}
              <motion.div
                className="absolute w-full max-w-2xl"
                initial={false}
                animate={{ opacity: phase === 4 ? 1 : 0, pointerEvents: phase === 4 ? 'auto' : 'none' }}
              >
                <div className="mb-4 rounded-md border border-[hsl(222,47%,11.2%)]/30 bg-[hsl(222,47%,11.2%)]/5 px-3 py-2 text-xs text-slate-800 flex items-center gap-2">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[hsl(222,47%,11.2%)]"><path d="m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.2 1.2 0 0 0 1.72 0L21.64 5.36a1.21 1.21 0 0 0 0-1.72Z"/><path d="m14 7 3 3"/><path d="M5 6v4"/><path d="M19 14v4"/><path d="M10 2v2"/><path d="M7 8H3"/><path d="M21 16h-4"/><path d="M11 3H9"/></svg>
                  <span className="flex-1">Showing your rewrite: <span className="italic">"Explain it like I'm new to business, and add a concrete example."</span></span>
                </div>
                <p className="text-base leading-relaxed text-slate-700 mb-4">
                  Think of price elasticity as a rubber band. If you pull it (change the price) and it stretches a lot (people stop buying), that's elastic demand. If you pull it and it's stiff (people keep buying anyway), that's inelastic demand.
                </p>
                <p className="text-base leading-relaxed text-slate-700 mb-4">
                  For example: If you sell luxury sports cars and raise the price by 20%, people might just buy a different brand. Your sales drop significantly. But if you sell the only patented life-saving medicine and raise the price 20%, patients have no choice but to pay. Sales barely drop.
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}