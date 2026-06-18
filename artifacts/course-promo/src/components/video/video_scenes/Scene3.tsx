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
          <div className="font-medium text-slate-500">1.3 Price Elasticity</div>
          
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
              <h1 className="text-4xl font-display font-bold text-slate-900 mb-8">Price Elasticity</h1>
              
              {/* Short Version */}
              <motion.div
                className="absolute w-full max-w-3xl"
                initial={false}
                animate={{ opacity: phase === 1 ? 1 : 0, pointerEvents: phase === 1 ? 'auto' : 'none' }}
              >
                <p className="text-2xl leading-relaxed text-slate-700">
                  Price elasticity is how much demand changes when you change the price. If a small rise sends customers running, demand is elastic; if they barely react, it's inelastic.
                </p>
              </motion.div>

              {/* Medium Version */}
              <motion.div
                className="absolute w-full max-w-3xl"
                initial={false}
                animate={{ opacity: phase === 2 ? 1 : 0, pointerEvents: phase === 2 ? 'auto' : 'none' }}
              >
                <p className="text-xl leading-relaxed text-slate-700 mb-6">
                  Price elasticity measures how sensitive buyers are to a change in price. Imagine a coffee shop with three rivals next door raising its price — many customers simply walk to a cheaper rival. That's elastic demand: bendy and quick to react.
                </p>
                <p className="text-xl leading-relaxed text-slate-700">
                  Now picture the only pharmacy in town raising the price of a prescription. Customers grumble but still pay, because there's nowhere else to go. That's inelastic demand. Whether a price rise earns more or backfires depends entirely on which one you're facing.
                </p>
              </motion.div>

              {/* Long Version */}
              <motion.div
                className="absolute w-full max-w-3xl"
                initial={false}
                animate={{ opacity: phase === 3 ? 1 : 0, pointerEvents: phase === 3 ? 'auto' : 'none' }}
              >
                <p className="text-lg leading-relaxed text-slate-700 mb-4">
                  Price elasticity measures how sensitive buyers are to a change in price. Imagine a coffee shop with three rivals next door raising its price — many customers simply walk to a cheaper rival. That's elastic demand: bendy and quick to react.
                </p>
                <p className="text-lg leading-relaxed text-slate-700 mb-4">
                  Economists put a number on this, the price elasticity of demand: roughly, the percentage change in how much people buy divided by the percentage change in price. When that number is large, demand is elastic; when it's small, demand is inelastic.
                </p>
                <p className="text-lg leading-relaxed text-slate-700 mb-4">
                  Whether a price rise earns more or backfires depends entirely on which one you're facing. Raising prices on inelastic goods (few substitutes) usually earns more; raising prices on elastic goods (easy substitutes) can drive customers away and lose money.
                </p>
                <div className="p-6 bg-white border border-slate-200 rounded-xl mt-6 shadow-sm">
                  <h4 className="font-bold text-slate-900 mb-2">Example: Coffee vs. Medicine</h4>
                  <p className="text-slate-600">A 10% price rise at a coffee shop surrounded by rivals can lose a third of its customers — elastic. The same 10% rise on a life-saving medicine barely changes how much is bought — inelastic.</p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}