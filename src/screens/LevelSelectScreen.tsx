
import React, { useState, useEffect, useRef } from 'react';
import { Icons, WORLD_COLORS, WORLD_NAMES } from '../constants.tsx';
import { type LevelProgress, type UserStats  } from '../gameTypes';
import { LEVELS } from '../game/LevelConfig';

interface LevelSelectScreenProps {
  progress: Record<number, LevelProgress>;
  userStats: UserStats;
  onSelectLevel: (levelId: number) => void;
  onBack: () => void;
  onWatchAd: () => void;
}

export default function LevelSelectScreen({ progress, userStats, onSelectLevel, onBack, onWatchAd }: LevelSelectScreenProps) {
  const [activeWorld, setActiveWorld] = useState(1);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const worldLevels = LEVELS.filter(l => l.world === activeWorld);
  const worlds = Array.from({ length: 10 }, (_, i) => i + 1);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  }, [activeWorld]);

  return (
    <div className="h-screen bg-slate-900 text-white flex flex-col overflow-hidden">
      {/* 
        [통합 헤더] 
        Back(왼쪽) | Stats(중앙) | Ad(오른쪽)
        모든 요소의 높이와 여백을 맞추어 디자인의 완성도를 높였습니다.
      */}
      <div 
        className="pb-4 px-6 flex items-center justify-between bg-slate-900/95 backdrop-blur-xl z-20 border-b border-slate-800"
        style={{ paddingTop: 'calc(env(safe-area-inset-top) + 2.5rem)' }}
      >
        {/* 왼쪽: 뒤로가기 */}
        <button onClick={onBack} className="p-2.5 bg-slate-800 rounded-2xl active:scale-90 transition-transform">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
            <path d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        {/* 중앙: 포인트/보석 통합 캡슐 (Select Stage 글자 대신 위치) */}
        <div className="bg-slate-800/80 px-4 py-2 rounded-full border border-slate-700/50 flex items-center gap-4 shadow-lg">
          <div className="flex items-center gap-1.5">
            <span className="text-amber-400 text-base">★</span>
            <span className="font-black text-xs tabular-nums">{userStats.totalPoints.toLocaleString()}</span>
          </div>
          <div className="w-px h-3 bg-slate-700"></div>
          <div className="flex items-center gap-1.5">
            <span className="text-base">💎</span>
            <span className="font-black text-sky-400 text-xs tabular-nums">{userStats.gems}</span>
          </div>
        </div>
        
        {/* 오른쪽: 광고 시청 (+30 보석) - 스탯 캡슐과 동일한 크기감 유지 */}
        <button 
          onClick={onWatchAd}
          className="bg-sky-500/20 border border-sky-500/50 px-4 py-2 rounded-full flex items-center gap-1.5 active:scale-95 transition-all shadow-md"
        >
          <span className="text-[10px] font-black text-sky-400">+30</span>
          <span className="text-base">💎</span>
        </button>
      </div>

      {/* World Tabs */}
      <div className="flex gap-2 p-4 overflow-x-auto no-scrollbar bg-slate-900/50 backdrop-blur-md z-10 shrink-0">
        {worlds.map(w => (
          <button
            key={w}
            onClick={() => setActiveWorld(w)}
            className={`px-6 py-2.5 rounded-2xl font-black transition-all whitespace-nowrap text-sm border-2 ${
              activeWorld === w 
                ? 'bg-amber-500 text-slate-900 border-amber-400 shadow-lg scale-105' 
                : 'bg-slate-800 text-slate-500 border-transparent'
            }`}
          >
            WORLD {w}
          </button>
        ))}
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
        {/* World Banner */}
        <div className={`${WORLD_COLORS[(activeWorld-1) % WORLD_COLORS.length]} p-8 rounded-[2rem] relative overflow-hidden shadow-2xl transition-all`}>
          <div className="relative z-10">
            <div className="text-white/60 text-[10px] font-black uppercase tracking-[0.3em] mb-1">Sector {activeWorld}</div>
            <h3 className="text-2xl font-black drop-shadow-lg leading-tight">
              {WORLD_NAMES[(activeWorld-1) % WORLD_NAMES.length] || `Region ${activeWorld}`}
            </h3>
            <div className="mt-4 bg-black/20 backdrop-blur-sm rounded-full px-4 py-1.5 inline-flex items-center gap-2">
              <Icons.Star className="w-4 h-4 text-amber-300" />
              <span className="text-white text-xs font-black">
                {worldLevels.filter(l => progress[l.id].stars > 0).length} / {worldLevels.length} COMPLETED
              </span>
            </div>
          </div>
          <Icons.Star className="absolute -right-6 -bottom-6 w-32 h-32 opacity-10 rotate-12" />
        </div>

        {/* Level Grid */}
        <div className="grid grid-cols-3 gap-3 pb-32">
          {worldLevels.map(level => {
            const lp = progress[level.id];
            const isLocked = !lp.unlocked;

            return (
              <button
                key={level.id}
                disabled={isLocked}
                onClick={() => onSelectLevel(level.id)}
                className={`relative aspect-square rounded-[1.5rem] flex flex-col items-center justify-center transition-all ${
                  isLocked 
                    ? 'bg-slate-800/40 border-2 border-dashed border-slate-700 opacity-40' 
                    : 'bg-slate-800 border-2 border-slate-700 hover:border-amber-500 active:scale-90 shadow-xl'
                }`}
              >
                {isLocked ? (
                  <Icons.Lock className="w-6 h-6 text-slate-600" />
                ) : (
                  <>
                    <span className="text-3xl font-black text-white leading-none mb-1">{level.id}</span>
                    <div className="flex gap-0.5">
                      {[1, 2, 3].map(s => (
                        <Icons.Star 
                          key={s} 
                          className={`w-3 h-3 ${lp.stars >= s ? 'text-amber-400' : 'text-slate-700'}`} 
                        />
                      ))}
                    </div>
                  </>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}