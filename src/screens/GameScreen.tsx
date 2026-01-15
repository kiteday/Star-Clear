
import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import { type LevelDef, type GameObject, GameObjectType } from '../gameTypes';

interface GameScreenProps {
  level: LevelDef;
  onComplete: (baseScore: number, timeRemaining: number, livesRemaining: number) => void;
  onFail: (reason?: 'TIME' | 'LIVES') => void;
  onQuit: () => void;
  reviveTrigger: number;
  currentGems: number;
}

const GameScreen: React.FC<GameScreenProps> = ({ level, onComplete, onFail, onQuit, reviveTrigger, currentGems }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState({
    time: level.timeLimit,
    score: 0,
    lives: 3,
    combo: 0,
    isGameOver: false,
    countdown: 3
  });
  
  const objectsRef = useRef<GameObject[]>([]);
  const nextIdRef = useRef(0);
  const requestRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);
  const spawnTimerRef = useRef(0);

  // 별이 떨어지는 주기 결정 로직 (여기서 빈도를 조절합니다)
  // 스폰 간격 계산 (130% 로직 유지)
  const spawnInterval = useMemo(() => {
    const starsNeeded = level.targetScore / 10;
    const starsToSpawn = starsNeeded * 1.5;
    return level.timeLimit / starsToSpawn;
  }, [level.targetScore, level.timeLimit]);

  
  useEffect(() => {
    if (reviveTrigger > 0) {
      setGameState(prev => {
        // 1. 상황 파악: 목숨이 없어서 죽었나? 아니면 시간이 다 되어서 죽었나?
        const isOutOfLives = prev.lives <= 0;
        const isOutOfTime = prev.time <= 0;

        return {
          ...prev,
          isGameOver: false,
          countdown: 3, // 부활 시 3초 카운트다운 다시 시작
          
          // 2. 목숨 보충: 목숨이 0 이하라면 1로 만들고, 아니면 현재 목숨 유지
          lives: isOutOfLives ? 1 : prev.lives+1,
          
          // 3. 시간 보충: 시간이 0 이하라면 10초를 주고, 아니면 현재 시간 유지 (또는 +10초)
          // 사용자의 의도에 따라 "0일 때만 10초"로 설정하거나 "기존 시간에 +10초"를 선택할 수 있습니다.
          time: isOutOfTime ? 10 : prev.time +10
        };
      });

      // 화면에 남은 폭탄 제거 (부활 직후 폭사 방지)
      // objectsRef.current = objectsRef.current.filter(o => o.type !== GameObjectType.BOMB);
      objectsRef.current = []; // 모든 객체 제거 또는 폭탄만 제거 선택
      console.log("💎 부활 성공: 목숨과 시간이 보충되었습니다.");
    }
  }, [reviveTrigger]);

  // 카운트다운 타이머
  useEffect(() => {
    if (gameState.countdown > 0) {
      const timer = setTimeout(() => {
        setGameState(prev => ({ ...prev, countdown: prev.countdown - 1 }));
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [gameState.countdown]);

  const spawnObject = useCallback((width: number) => {
    const rand = Math.random();
    let type = GameObjectType.STAR_GOLD;
    
    if (rand < level.bombChance) {
      type = GameObjectType.BOMB;
    } else if (rand < level.bombChance + 0.2) {
      type = GameObjectType.STAR_SILVER; 
    }

    const obj: GameObject = {
      id: nextIdRef.current++,
      type,
      x: Math.random() * (width - 60) + 30,
      y: -50,
      radius: type === GameObjectType.BOMB ? 25 : 22,
      speed: level.fallSpeed * (0.8 + Math.random() * 0.4),
      opacity: 1,
      isCaught: false
    };
    
    objectsRef.current.push(obj);
  }, [level.bombChance, level.fallSpeed]);

  const draw = useCallback((time: number) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    objectsRef.current.forEach(obj => {
      if (obj.isCaught) return;
      ctx.save();
      ctx.translate(obj.x, obj.y);
      
      if (obj.type === GameObjectType.BOMB) {
        ctx.beginPath();
        ctx.arc(0, 0, obj.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#1e293b';
        ctx.fill();
        ctx.strokeStyle = '#f43f5e';
        ctx.lineWidth = 3;
        ctx.stroke();
        ctx.fillStyle = '#f43f5e';
        ctx.font = 'bold 20px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('!', 0, 7);
      } else {
        const color = obj.type === GameObjectType.STAR_GOLD ? '#fbbf24' : '#38bdf8';
        ctx.rotate(time / 800);
        ctx.beginPath();
        const spikes = 5;
        for (let i = 0; i < spikes * 2; i++) {
          const r = i % 2 === 0 ? obj.radius : obj.radius / 2;
          const angle = (i * Math.PI) / spikes;
          ctx.lineTo(Math.cos(angle) * r, Math.sin(angle) * r);
        }
        ctx.closePath();
        ctx.fillStyle = color;
        ctx.shadowColor = color;
        ctx.shadowBlur = 15;
        ctx.fill();
      }
      ctx.restore();
    });
  }, []);

  const update = useCallback((time: number) => {
    if (gameState.countdown > 0 || gameState.isGameOver) {
      lastTimeRef.current = time;
      draw(time);
      requestRef.current = requestAnimationFrame(update);
      return;
    }

    if (lastTimeRef.current === null) {
      lastTimeRef.current = time;
    }
    const delta = (time - lastTimeRef.current) / 1000;
    lastTimeRef.current = time;

    setGameState(prev => ({
      ...prev,
      time: Math.max(0, prev.time - delta)
    }));

    spawnTimerRef.current += delta;
    if (spawnTimerRef.current > spawnInterval) {
      if (canvasRef.current) spawnObject(canvasRef.current.width);
      spawnTimerRef.current = 0;
    }

    if (canvasRef.current) {
      objectsRef.current = objectsRef.current.filter(obj => {
        if (obj.isCaught) return false;
        obj.y += obj.speed;
        if (obj.y > canvasRef.current!.height + 50) {
          if (obj.type === GameObjectType.STAR_GOLD) {
            setGameState(prev => ({ ...prev, combo: 0 }));
          }
          return false;
        }
        return true;
      });
    }

    draw(time);
    requestRef.current = requestAnimationFrame(update);
  }, [gameState.countdown, gameState.isGameOver, spawnInterval, spawnObject, draw]);

  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    requestRef.current = requestAnimationFrame(update);
    return () => {
      window.removeEventListener('resize', handleResize);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [update]);

  useEffect(() => {
    if (gameState.isGameOver) return;
    if (gameState.score >= level.targetScore) {
      setGameState(p => ({ ...p, isGameOver: true }));
      onComplete(gameState.score, gameState.time, gameState.lives);
    } else if (gameState.lives <= 0) {
      setGameState(p => ({ ...p, isGameOver: true }));
      onFail('LIVES');
    } else if (gameState.time <= 0) {
      setGameState(p => ({ ...p, isGameOver: true }));
      onFail('TIME');
    }
  }, [gameState.score, gameState.lives, gameState.time, level.targetScore, onComplete, onFail]);

  const handlePointer = (clientX: number, clientY: number) => {
    if (gameState.isGameOver || gameState.countdown > 0) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    for (let i = objectsRef.current.length - 1; i >= 0; i--) {
      const obj = objectsRef.current[i];
      if (obj.isCaught) continue;
      const dist = Math.sqrt((obj.x - x) ** 2 + (obj.y - y) ** 2);
      if (dist < 65) {
        obj.isCaught = true;
        if (obj.type === GameObjectType.BOMB) {
          setGameState(prev => ({ ...prev, lives: Math.max(0, prev.lives - 1), combo: 0 }));
        } else if (obj.type === GameObjectType.STAR_GOLD) {
          setGameState(prev => ({ ...prev, score: prev.score + 10, combo: prev.combo + 1 }));
        } else if (obj.type === GameObjectType.STAR_SILVER) {
          setGameState(prev => ({ ...prev, score: Math.max(0, prev.score - 20), combo: 0 }));
        }
        break;
      }
    }
  };

  const roundedTime = Math.ceil(gameState.time);
  const isTimeUrgent = roundedTime <= 10;

  return (
    <div className="relative w-full h-screen bg-slate-900 overflow-hidden touch-none select-none">
      <canvas
        ref={canvasRef}
        onMouseDown={(e) => handlePointer(e.clientX, e.clientY)}
        onTouchStart={(e) => handlePointer(e.touches[0].clientX, e.touches[0].clientY)}
        className="block w-full h-full"
      />

      <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-start pointer-events-none z-20">
        <div className="flex flex-col gap-2">
          <div className="bg-black/40 p-3 rounded-2xl backdrop-blur-md pointer-events-auto border border-white/10">
            <div className="flex gap-1 mb-1">
              {Array.from({ length: 3 }).map((_, i) => (
                <span key={i} className={`text-xl transition-opacity duration-300 ${i < gameState.lives ? 'opacity-100' : 'opacity-10'}`}>❤️</span>
              ))}
            </div>
            <div className="text-white font-black text-lg tabular-nums">
              {gameState.score.toLocaleString()} <span className="text-slate-500 text-xs">/ {level.targetScore}</span>
            </div>
          </div>
          <div className="bg-black/40 px-3 py-1.5 rounded-full backdrop-blur-md border border-white/5 flex items-center gap-2 self-start">
            <span className="text-sm">💎</span>
            <span className="text-sky-400 font-bold text-xs">{currentGems}</span>
          </div>
        </div>

        <div className="bg-black/40 px-5 py-2 rounded-2xl backdrop-blur-md text-center pointer-events-auto border border-white/10 min-w-[100px]">
          <div className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Time Left</div>
          {/* 잔상 방지를 위해 transition과 animate 클래스를 제거한 무색무취의 안정적인 타이머 UI */}
          <div className={`text-2xl font-black tabular-nums ${isTimeUrgent ? 'text-rose-500' : 'text-white'}`}>
            {roundedTime}s
          </div>
        </div>
      </div>

      {gameState.combo > 1 && (
        <div className="absolute top-36 left-1/2 -translate-x-1/2 pointer-events-none animate-bounce z-10">
          <div className="bg-amber-500 text-slate-900 px-6 py-1 rounded-full font-black italic text-xl shadow-lg">
            {gameState.combo} COMBO
          </div>
        </div>
      )}

      {gameState.countdown > 0 && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50">
          <div className="text-9xl font-black text-amber-400 animate-ping">
            {gameState.countdown}
          </div>
        </div>
      )}

      <button onClick={onQuit} className="absolute bottom-6 left-6 bg-slate-800/90 px-6 py-3 rounded-2xl text-white font-bold pointer-events-auto border border-slate-700 z-20 active:scale-95 transition-transform">
        QUIT
      </button>
    </div>
  );
};

export default GameScreen;