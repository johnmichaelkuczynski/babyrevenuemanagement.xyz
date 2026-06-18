import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export function Scene2() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 500),
      setTimeout(() => setPhase(2), 2000), // Sidebar slide in
      setTimeout(() => setPhase(3), 3500), // List items stagger
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  const topics = [
    "1.1 What operations & supply chain analytics is",
    "1.2 Inventory — the cost of too much and too little",
    "1.3 The bullwhip effect — small ripples, big waves",
    "1.4 Bottlenecks — why the slowest step rules",
    "1.5 Waiting lines — the hidden math of queues",
    "1.6 Demand forecasting — stocking for a future you can't see",
    "1.7 Routing and optimization — moving things for less",
    "1.8 Resilience — building a chain that doesn't break"
  ];

  return (
    <motion.div 
      className="absolute inset-0 flex bg-slate-100"
      initial={{ opacity: 0, x: '10vw' }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: '-10vw' }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="absolute inset-0 bg-slate-50 opacity-50 pointer-events-none" />

      {/* Main product mockup container */}
      <motion.div 
        className="w-[85vw] h-[80vh] m-auto bg-white rounded-xl shadow-soft flex overflow-hidden border border-slate-200"
        initial={{ y: '10vh', opacity: 0 }}
        animate={phase >= 1 ? { y: 0, opacity: 1 } : { y: '10vh', opacity: 0 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Sidebar */}
        <div className="w-[30vw] bg-slate-50 border-r border-slate-200 p-8 flex flex-col">
          <div className="w-12 h-12 bg-blue-600 rounded-lg mb-8" />
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Unit 1</h3>
          
          <div className="flex flex-col gap-4">
            {topics.map((topic, i) => (
              <motion.div 
                key={i}
                className={`text-sm font-medium ${i === 0 ? 'text-blue-600' : 'text-slate-600'}`}
                initial={{ opacity: 0, x: -20 }}
                animate={phase >= 3 ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                transition={{ duration: 0.5, delay: phase >= 3 ? i * 0.1 : 0 }}
              >
                {topic}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Content Pane */}
        <div className="flex-1 p-16 flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={phase >= 2 ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-[3vw] font-bold text-slate-900 leading-tight mb-4">
              Real concepts.<br />No jargon.
            </h2>
            <p className="text-xl text-slate-500 max-w-lg">
              The curriculum covers exactly what you need to know about how things move through a business, told in plain language.
            </p>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}
