import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useVideoPlayer } from '@/lib/video';
import { Scene1 } from './video_scenes/Scene1';
import { Scene2 } from './video_scenes/Scene2';
import { Scene3 } from './video_scenes/Scene3';
import { Scene4 } from './video_scenes/Scene4';
import { Scene5 } from './video_scenes/Scene5';
import { Scene6 } from './video_scenes/Scene6';
import { Scene7 } from './video_scenes/Scene7';
import { Scene8 } from './video_scenes/Scene8';

export const SCENE_DURATIONS = {
  s1_intro: 3500,
  s2_curriculum: 5000,
  s3_depths: 5000,
  s4_tutor: 7000,
  s5_practice: 6000,
  s6_grading: 6000,
  s7_detection: 6000,
  s8_outro: 6000
};

const SCENE_COMPONENTS: Record<string, React.ComponentType> = {
  s1_intro: Scene1,
  s2_curriculum: Scene2,
  s3_depths: Scene3,
  s4_tutor: Scene4,
  s5_practice: Scene5,
  s6_grading: Scene6,
  s7_detection: Scene7,
  s8_outro: Scene8
};

const SCENE_START_SEC: Record<string, number> = (() => {
  const out: Record<string, number> = {};
  let cumulativeMs = 0;
  for (const [key, ms] of Object.entries(SCENE_DURATIONS)) {
    out[key] = cumulativeMs / 1000;
    cumulativeMs += ms;
  }
  return out;
})();

const AUDIO_SEEK_EPSILON_SEC = 0.18;

export default function VideoTemplate({
  durations = SCENE_DURATIONS,
  loop = true,
  muted = false,
  onSceneChange,
}: {
  durations?: Record<string, number>;
  loop?: boolean;
  muted?: boolean;
  onSceneChange?: (sceneKey: string) => void;
} = {}) {
  const { currentSceneKey } = useVideoPlayer({ durations, loop });

  useEffect(() => {
    onSceneChange?.(currentSceneKey);
  }, [currentSceneKey, onSceneChange]);

  const baseSceneKey = currentSceneKey.replace(/_r[12]$/, '') as keyof typeof SCENE_DURATIONS;
  const SceneComponent = SCENE_COMPONENTS[baseSceneKey];

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = 0.45;
    const targetTime = SCENE_START_SEC[baseSceneKey] ?? 0;
    if (Math.abs(audio.currentTime - targetTime) > AUDIO_SEEK_EPSILON_SEC) {
      audio.currentTime = targetTime;
    }
    audio.play().catch(() => {});
  }, [currentSceneKey, baseSceneKey, muted]);

  const showChrome = !['s1_intro', 's8_outro'].includes(baseSceneKey as string);

  return (
    <div className="w-full h-screen overflow-hidden relative bg-slate-50 text-slate-900 flex" style={{ fontFamily: 'var(--font-body)' }}>
      {/* Persistent Background Layer */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <motion.div
          className="absolute w-[80vw] h-[80vw] rounded-full opacity-[0.03] blur-3xl"
          style={{ background: 'radial-gradient(circle, var(--color-primary), transparent)' }}
          animate={{ x: ['-20%', '30%', '-10%'], y: ['-10%', '40%', '-20%'], scale: [1, 1.2, 0.9] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      {showChrome && (
        <motion.div 
          className="w-64 bg-[#0a1120] text-white flex-shrink-0 flex flex-col z-50 shadow-xl"
          initial={{ x: -300 }} animate={{ x: 0 }} exit={{ x: -300 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="h-16 flex items-center px-6 border-b border-white/10 font-display font-bold text-lg text-white">
            Pricing Analytics
          </div>
          <div className="p-4 flex flex-col gap-1 text-sm font-medium">
            <div className="px-3 py-2.5 rounded-md hover:bg-white/10 text-slate-300">Dashboard</div>
            <div className="px-3 py-2.5 rounded-md bg-white/10 text-white">Coursework</div>
            <div className="px-3 py-2.5 rounded-md hover:bg-white/10 text-slate-300">Diagnostics</div>
            <div className="px-3 py-2.5 rounded-md hover:bg-white/10 text-slate-300">Grades</div>
            <div className="px-3 py-2.5 rounded-md hover:bg-white/10 text-slate-300">Analytics</div>
          </div>
        </motion.div>
      )}

      <div className="flex-1 flex flex-col relative z-10 w-full h-full overflow-hidden">
        {showChrome && (
          <motion.div 
            className="h-16 bg-white border-b border-slate-200 flex items-center px-6 justify-between flex-shrink-0 z-50"
            initial={{ y: -100 }} animate={{ y: 0 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="text-sm font-medium text-slate-500 tracking-wider uppercase">Unit 1: Foundations</div>
            <div className="w-8 h-8 rounded-full bg-slate-200"></div>
          </motion.div>
        )}

        <div className="flex-1 relative">
          <AnimatePresence mode="popLayout">
            {SceneComponent && <SceneComponent key={currentSceneKey} />}
          </AnimatePresence>
        </div>
      </div>

      <audio
        ref={audioRef}
        src={`${import.meta.env.BASE_URL}audio/bg_music.mp3`}
        preload="auto"
        autoPlay
        muted={muted}
      />
    </div>
  );
}
