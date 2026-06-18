import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export function Scene1() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 500),
      setTimeout(() => setPhase(2), 2000),
      setTimeout(() => setPhase(3), 4000),
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
      <div className="text-center max-w-5xl px-8 z-10">
        <motion.h1 
          className="text-[5vw] font-bold tracking-tight text-slate-900 mb-8 font-display leading-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          Operations & Supply Chain Analytics <br/><span className="text-blue-600">for Children</span>
        </motion.h1>
        
        <motion.p 
          className="text-[2vw] text-slate-600 font-serif italic"
          initial={{ opacity: 0, y: 10 }}
          animate={phase >= 1 ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          A friendly intro to how things really move through a business — taught, tutored, and graded by AI.
        </motion.p>
      </div>

      <motion.div 
        className="absolute bottom-0 right-0 w-[40vw] h-[40vh] bg-blue-50 rounded-tl-full opacity-50 pointer-events-none"
        initial={{ scale: 0 }}
        animate={phase >= 2 ? { scale: 1 } : { scale: 0 }}
        transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
      />
    </motion.div>
  );
}
