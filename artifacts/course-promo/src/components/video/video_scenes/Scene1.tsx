import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export function Scene1() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 500),
      setTimeout(() => setPhase(2), 1500),
      setTimeout(() => setPhase(3), 3000),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div className="absolute inset-0 flex items-center justify-center bg-slate-900"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.1 }}
      transition={{ duration: 0.8 }}
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          className="absolute top-1/4 -left-1/4 w-[80vw] h-[80vw] rounded-full bg-primary/20 blur-[120px]"
          animate={{ x: [0, 100, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        />
        <motion.div 
          className="absolute bottom-1/4 -right-1/4 w-[60vw] h-[60vw] rounded-full bg-accent/20 blur-[100px]"
          animate={{ x: [0, -100, 0], scale: [1, 1.5, 1] }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
        />
      </div>

      <div className="relative z-10 text-center flex flex-col items-center px-12">
        <motion.div 
          className="w-24 h-24 bg-white rounded-2xl shadow-elevated mb-8 flex items-center justify-center overflow-hidden border-4 border-slate-800"
          initial={{ scale: 0, rotate: -15, opacity: 0 }}
          animate={phase >= 1 ? { scale: 1, rotate: 0, opacity: 1 } : { scale: 0, rotate: -15, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 17L12 22L22 17" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 12L12 17L22 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </motion.div>
        
        <motion.h1 
          className="text-5xl md:text-7xl font-bold text-white mb-6 font-display"
          initial={{ y: 50, opacity: 0 }}
          animate={phase >= 2 ? { y: 0, opacity: 1 } : { y: 50, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        >
          Basic Revenue Management & Pricing <br/>
          <span className="text-accent">Analytics</span>
        </motion.h1>

        <motion.p 
          className="text-xl md:text-2xl text-slate-300 max-w-3xl font-body"
          initial={{ y: 20, opacity: 0 }}
          animate={phase >= 3 ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          A complete, plain-language course on why prices are what they are.<br/>
          Taught, tutored, drilled, and graded by AI.
        </motion.p>
      </div>
    </motion.div>
  );
}