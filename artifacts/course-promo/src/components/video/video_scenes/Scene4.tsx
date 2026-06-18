import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export function Scene4() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 500),
      setTimeout(() => setPhase(2), 2000), // Show AI Tutor panel
      setTimeout(() => setPhase(3), 3500), // Start streaming answer
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  const answerText = "Because the coffee shop faces elastic demand. With three rivals next door, customers can easily switch, so a price rise sends many of them away — and losing that many customers costs more than the extra you earn per cup. The pharmacy can raise prices because its customers have nowhere else to go.";

  return (
    <motion.div 
      className="absolute inset-0 flex items-center justify-center bg-slate-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, x: '-10vw' }}
      transition={{ duration: 0.8 }}
    >
      <motion.div 
        className="w-[90vw] h-[85vh] bg-white rounded-2xl shadow-elevated flex overflow-hidden border border-slate-200"
      >
        <div className="flex-1 p-16 bg-slate-50 relative overflow-hidden">
          <div className="max-w-3xl opacity-40 blur-[2px] pointer-events-none transition-all duration-1000">
            <h1 className="text-4xl font-display font-bold text-slate-900 mb-8">Price Elasticity</h1>
            <p className="text-xl leading-relaxed text-slate-700 mb-6">
              Price elasticity measures how sensitive buyers are to a change in price. Imagine a coffee shop with three rivals next door raising its price — many customers simply walk to a cheaper rival. That's elastic demand: bendy and quick to react.
            </p>
            <div className="p-6 bg-white border border-slate-200 rounded-xl mt-6 shadow-sm">
              <h4 className="font-bold text-slate-900 mb-2">Example: Coffee vs. Medicine</h4>
              <p className="text-slate-600">A 10% price rise at a coffee shop surrounded by rivals can lose a third of its customers, while the same rise on a life-saving medicine barely changes how much is bought.</p>
            </div>
          </div>
        </div>

        {/* AI Tutor Drawer */}
        <motion.div 
          className="w-[450px] bg-white border-l border-slate-200 shadow-[-10px_0_30px_rgba(0,0,0,0.05)] flex flex-col z-10"
          initial={{ x: '100%' }}
          animate={phase >= 2 ? { x: 0 } : { x: '100%' }}
          transition={{ type: 'spring', stiffness: 200, damping: 25 }}
        >
          <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent"><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l1.8 5.2L19 9l-5.2 1.8L12 16l-1.8-5.2L5 9l5.2-1.8z" /></svg></div>
              <span className="font-bold text-slate-900">AI Tutor</span>
            </div>
          </div>
          
          <div className="flex-1 p-6 flex flex-col gap-6 overflow-hidden">
            {/* User message */}
            <motion.div 
              className="self-end bg-slate-100 text-slate-800 rounded-2xl rounded-tr-sm p-4 max-w-[85%] text-sm"
              initial={{ opacity: 0, y: 10 }}
              animate={phase >= 2 ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
              transition={{ delay: 0.5 }}
            >
              Wait, if raising prices earns more money, why doesn't the coffee shop just raise its prices too?
            </motion.div>

            {/* AI response streaming */}
            {phase >= 3 && (
              <div className="self-start flex gap-3 max-w-[90%]">
                <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center shrink-0 mt-1 text-accent"><svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l1.8 5.2L19 9l-5.2 1.8L12 16l-1.8-5.2L5 9l5.2-1.8z" /></svg></div>
                <div className="bg-primary text-white rounded-2xl rounded-tl-sm p-4 text-sm leading-relaxed shadow-sm">
                  <TypewriterText text={answerText} speed={15} />
                </div>
              </div>
            )}
          </div>
          
          <div className="p-4 border-t border-slate-200">
            <div className="bg-slate-100 rounded-full h-10 w-full flex items-center px-4 text-slate-400 text-sm">
              Ask a question about this section...
            </div>
          </div>
        </motion.div>

      </motion.div>
    </motion.div>
  );
}

function TypewriterText({ text, speed = 20 }: { text: string, speed?: number }) {
  const [displayed, setDisplayed] = useState('');
  
  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i <= text.length) {
        setDisplayed(text.slice(0, i));
        i += 2;
      } else {
        clearInterval(interval);
      }
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed]);

  return <span>{displayed}</span>;
}