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
      className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900 text-white overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
    >
      <div className="absolute inset-0 pointer-events-none">
        <motion.div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120vw] h-[120vw] rounded-full bg-primary/10 blur-[150px]"
          animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="relative z-10 text-center flex flex-col items-center">
        <div className="flex flex-wrap justify-center gap-4 text-2xl md:text-3xl font-bold text-slate-400 mb-12 px-8">
          <motion.span initial={{ y: 20, opacity: 0 }} animate={phase >= 1 ? { y: 0, opacity: 1 } : {}}>Taught.</motion.span>
          <motion.span initial={{ y: 20, opacity: 0 }} animate={phase >= 2 ? { y: 0, opacity: 1 } : {}}>Tutored.</motion.span>
          <motion.span initial={{ y: 20, opacity: 0 }} animate={phase >= 3 ? { y: 0, opacity: 1 } : {}}>Drilled.</motion.span>
          <motion.span initial={{ y: 20, opacity: 0 }} animate={phase >= 4 ? { y: 0, opacity: 1 } : {}}>Graded.</motion.span>
          <motion.span initial={{ y: 20, opacity: 0 }} animate={phase >= 5 ? { y: 0, opacity: 1 } : {}} className="text-white bg-primary/20 px-4 py-1 rounded-lg border border-primary/30">And proven honest.</motion.span>
        </div>

        <motion.div 
          className="w-20 h-20 bg-white rounded-2xl shadow-elevated mb-8 flex items-center justify-center border-4 border-slate-800"
          initial={{ scale: 0, opacity: 0 }}
          animate={phase >= 6 ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 17L12 22L22 17" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 12L12 17L22 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </motion.div>

        <motion.h1 
          className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6 font-display"
          initial={{ opacity: 0, y: 30 }}
          animate={phase >= 6 ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
        >
          Operations & Supply Chain <br/>
          <span className="text-accent">Analytics for Children</span>
        </motion.h1>
      </div>
    </motion.div>
  );
}