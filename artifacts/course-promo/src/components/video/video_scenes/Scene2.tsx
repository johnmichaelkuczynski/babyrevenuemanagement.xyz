import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export function Scene2() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 500),
      setTimeout(() => setPhase(2), 1500), // Show KPIs
      setTimeout(() => setPhase(3), 2500), // Show Mastery Bars
      setTimeout(() => setPhase(4), 3500), // Show Activity Feed
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  const topics = [
    { title: "What Revenue Management Is", progress: 100 },
    { title: "Willingness to Pay", progress: 85 },
    { title: "Price Elasticity", progress: 60 },
    { title: "Price Discrimination & Fences", progress: 20 },
  ];

  const activities = [
    {
      text: "Completed Unit 1 Assessment",
      time: "2h ago",
      icon: (
        <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
      ),
    },
    {
      text: "Earned 3-day Streak",
      time: "Yesterday",
      icon: (
        <svg className="w-4 h-4 text-orange-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2c.5 3-1.5 4.5-3 6.5C7 11 6 13 7 15a5 5 0 0010 0c0-2-1-3.5-2.5-5 .5 1.5 0 2.5-1 3 .5-2-1-4-1.5-6.5z" /></svg>
      ),
    },
    {
      text: "Mastered: Willingness to Pay",
      time: "2 days ago",
      icon: (
        <svg className="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l2.9 6.3L22 9l-5 4.7L18.2 21 12 17.4 5.8 21 7 13.7 2 9l7.1-.7z" /></svg>
      ),
    },
  ];

  return (
    <motion.div 
      className="absolute inset-0 flex items-center justify-center bg-slate-50"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, x: '-10vw' }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <motion.div 
        className="w-[90vw] h-[85vh] bg-white rounded-2xl shadow-elevated flex overflow-hidden border border-slate-200"
      >
        {/* App Sidebar */}
        <div className="w-64 bg-slate-50 border-r border-slate-200 flex flex-col">
          <div className="p-6 flex items-center gap-3 border-b border-slate-200">
            <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="font-display font-bold text-slate-900">RMPA</span>
          </div>
          <div className="p-4 flex-1 space-y-1">
            <div className="px-3 py-2 text-sm font-medium text-slate-500 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
              Dashboard
            </div>
            <div className="px-3 py-2 bg-slate-200/50 rounded-lg text-sm font-medium text-primary flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
              Analytics
            </div>
          </div>
        </div>

        {/* Analytics Content */}
        <div className="flex-1 overflow-hidden flex flex-col bg-slate-50">
          <div className="p-8 pb-4">
            <h1 className="text-3xl font-display font-bold text-slate-900">Analytics</h1>
            <p className="text-slate-500 mt-1">Track your progress and mastery.</p>
          </div>

          <div className="p-8 pt-0 flex-1 grid grid-cols-3 gap-6 items-start">
            {/* Main column: KPIs and Mastery */}
            <div className="col-span-2 space-y-6">
              {/* KPIs */}
              <div className="grid grid-cols-3 gap-4">
                <motion.div 
                  className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm"
                  initial={{ y: 20, opacity: 0 }}
                  animate={phase >= 2 ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
                >
                  <div className="text-sm font-medium text-slate-500 mb-1">Total Attempts</div>
                  <div className="text-3xl font-bold font-display text-slate-900">
                    {phase >= 2 ? <NumberCounter target={248} /> : 0}
                  </div>
                </motion.div>
                <motion.div 
                  className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm"
                  initial={{ y: 20, opacity: 0 }}
                  animate={phase >= 2 ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <div className="text-sm font-medium text-slate-500 mb-1">Accuracy</div>
                  <div className="text-3xl font-bold font-display text-primary">
                    {phase >= 2 ? <NumberCounter target={92} /> : 0}%
                  </div>
                </motion.div>
                <motion.div 
                  className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm"
                  initial={{ y: 20, opacity: 0 }}
                  animate={phase >= 2 ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="text-sm font-medium text-slate-500 mb-1">Current Streak</div>
                  <div className="text-3xl font-bold font-display text-orange-500 flex items-center gap-1">
                    {phase >= 2 ? <NumberCounter target={5} /> : 0} <svg className="w-5 h-5 text-orange-500 inline-block" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2c.5 3-1.5 4.5-3 6.5C7 11 6 13 7 15a5 5 0 0010 0c0-2-1-3.5-2.5-5 .5 1.5 0 2.5-1 3 .5-2-1-4-1.5-6.5z" /></svg>
                  </div>
                </motion.div>
              </div>

              {/* Mastery Bars */}
              <motion.div 
                className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={phase >= 3 ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              >
                <h3 className="font-bold text-slate-900 mb-4">Topic Mastery</h3>
                <div className="space-y-4">
                  {topics.map((topic, i) => (
                    <div key={i}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium text-slate-700">{topic.title}</span>
                        <span className="text-slate-500">{topic.progress}%</span>
                      </div>
                      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                        <motion.div 
                          className="h-full bg-primary"
                          initial={{ width: 0 }}
                          animate={phase >= 3 ? { width: `${topic.progress}%` } : { width: 0 }}
                          transition={{ duration: 1, delay: i * 0.1, ease: "easeOut" }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Right column: Activity Feed */}
            <motion.div 
              className="col-span-1 bg-white p-6 rounded-xl border border-slate-200 shadow-sm"
              initial={{ opacity: 0, x: 20 }}
              animate={phase >= 4 ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
            >
              <h3 className="font-bold text-slate-900 mb-4">Recent Activity</h3>
              <div className="space-y-6">
                {activities.map((activity, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                      {activity.icon}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900 leading-snug">{activity.text}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function NumberCounter({ target }: { target: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 1000;
    const increment = target / (duration / 16);
    
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [target]);

  return <span>{count}</span>;
}