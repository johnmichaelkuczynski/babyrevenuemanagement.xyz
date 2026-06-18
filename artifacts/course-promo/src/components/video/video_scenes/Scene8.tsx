import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export function Scene8() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 500),
      setTimeout(() => setPhase(2), 1200),
      setTimeout(() => setPhase(3), 1900),
      setTimeout(() => setPhase(4), 2600),
      setTimeout(() => setPhase(5), 3300),
      setTimeout(() => setPhase(6), 4500),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div 
      className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950 text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
    >
      <div className="text-center">
        <div className="flex gap-4 text-3xl md:text-4xl font-bold text-slate-400 mb-12 overflow-hidden px-8 py-2">
          <motion.span initial={{ y: 50, opacity: 0 }} animate={phase >= 1 ? { y: 0, opacity: 1 } : {}}>Taught.</motion.span>
          <motion.span initial={{ y: 50, opacity: 0 }} animate={phase >= 2 ? { y: 0, opacity: 1 } : {}}>Tutored.</motion.span>
          <motion.span initial={{ y: 50, opacity: 0 }} animate={phase >= 3 ? { y: 0, opacity: 1 } : {}}>Drilled.</motion.span>
          <motion.span initial={{ y: 50, opacity: 0 }} animate={phase >= 4 ? { y: 0, opacity: 1 } : {}}>Graded.</motion.span>
          <motion.span initial={{ y: 50, opacity: 0 }} animate={phase >= 5 ? { y: 0, opacity: 1 } : {}} className="text-white">And proven honest.</motion.span>
        </div>

        <motion.h1 
          className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6 font-display"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={phase >= 6 ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          Operations & Supply Chain Analytics <br/><span className="text-blue-500">for Children</span>
        </motion.h1>
      </div>
      
      {/* Decorative ambient background */}
      <motion.div 
        className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-950 to-slate-950 pointer-events-none"
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
    </motion.div>
  );
}
