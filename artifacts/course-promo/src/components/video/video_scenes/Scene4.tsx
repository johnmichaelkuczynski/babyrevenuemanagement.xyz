import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export function Scene4() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 500),
      setTimeout(() => setPhase(2), 1500), // Question appears
      setTimeout(() => setPhase(3), 3000), // Answer starts streaming
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  const question = "A car wash can vacuum 20 cars an hour but can only dry 10. They buy a faster vacuum. Why won't more cars get washed?";
  const answer = "Drying is the bottleneck at 10 cars an hour, so the whole line can only finish 10 — a faster vacuum just makes cars pile up waiting to dry. To wash more, you have to speed up drying, the slowest step.";

  return (
    <motion.div 
      className="absolute inset-0 flex bg-slate-100"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      <motion.div 
        className="w-[85vw] h-[80vh] m-auto bg-white rounded-xl shadow-soft flex overflow-hidden border border-slate-200"
      >
        <div className="flex-1 p-12 bg-slate-50 border-r border-slate-200 relative overflow-hidden">
          <div className="max-w-2xl blur-sm opacity-30 pointer-events-none">
            <h1 className="text-4xl font-bold text-slate-900 mb-8">Bottlenecks</h1>
            <p className="text-xl leading-relaxed text-slate-700 mb-6">
              A bottleneck is the slowest step in a process — and the whole system can only move as fast as that one step.
            </p>
          </div>
        </div>

        {/* AI Tutor Panel */}
        <motion.div 
          className="w-[40vw] bg-white flex flex-col shadow-[-10px_0_30px_rgba(0,0,0,0.05)] z-10"
          initial={{ x: '100%' }}
          animate={phase >= 1 ? { x: 0 } : { x: '100%' }}
          transition={{ type: 'spring', stiffness: 200, damping: 25 }}
        >
          <div className="p-6 border-b border-slate-100 flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-emerald-100 flex items-center justify-center text-emerald-600">✨</div>
            <span className="font-bold text-slate-900">AI Tutor</span>
          </div>
          
          <div className="flex-1 p-6 flex flex-col gap-6">
            {phase >= 2 && (
              <motion.div 
                className="self-end bg-blue-600 text-white rounded-2xl rounded-tr-sm p-4 max-w-[85%]"
                initial={{ opacity: 0, y: 10, scale: 0.95, transformOrigin: 'top right' }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
              >
                {question}
              </motion.div>
            )}

            {phase >= 3 && (
              <div className="self-start bg-slate-100 text-slate-800 rounded-2xl rounded-tl-sm p-4 max-w-[85%] flex items-start gap-3">
                <div className="mt-1">✨</div>
                <div>
                  <TypewriterText text={answer} />
                </div>
              </div>
            )}
          </div>
        </motion.div>

      </motion.div>
    </motion.div>
  );
}

function TypewriterText({ text }: { text: string }) {
  const [displayedText, setDisplayedText] = useState("");
  
  useEffect(() => {
    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex <= text.length) {
        setDisplayedText(text.slice(0, currentIndex));
        currentIndex += 2; // Stream a bit faster
      } else {
        clearInterval(interval);
      }
    }, 20);
    return () => clearInterval(interval);
  }, [text]);

  return <span>{displayedText}</span>;
}
