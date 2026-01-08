import './App.css';
import { useState, useCallback } from 'react';

import { 
  ScreenState,
  type UserProfile,
  type UserStats, type LevelProgress 
} from './gameTypes';

// import { ScreenState, type UserProfile, type UserStats, type LevelProgress } from './gameTypes';
import { LEVELS } from './game/LevelConfig';
import * as StorageService from './services/StorageService';
import MenuScreen from './screens/MenuScreen';
import LevelSelectScreen from './screens/LevelSelectScreen';
import GameScreen from './screens/GameScreen';
import { BannerAd, InterstitialAd, RewardedAd } from './components/Ads';

import { AdMob } from '@capacitor-community/admob';

export async function initializeAdMob() {
  // 1. 광고 라이브러리 초기화
  await AdMob.initialize(); 

  // 2. iOS 전용 앱 추적 권한 요청 (ATT 팝업)
  // 이 메서드가 실행되면 아이폰에서 "추적 허용" 팝업이 뜹니다.
  const status = await AdMob.requestTrackingAuthorization();
  console.log('Tracking Status:', status);
}

export default function App() {
  const [screen, setScreen] = useState<ScreenState>(ScreenState.MENU);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [userStats, setUserStats] = useState<UserStats>(StorageService.getUserStats());
  const [progress, setProgress] = useState<Record<number, LevelProgress>>(StorageService.getProgress());
  const [activeLevelId, setActiveLevelId] = useState<number>(1);
  const [adsRemoved, setAdsRemoved] = useState<boolean>(StorageService.isAdsRemoved());
  const [showInterstitial, setShowInterstitial] = useState(false);
  const [showRewarded, setShowRewarded] = useState(false);
  const [reviveTrigger, setReviveTrigger] = useState(0);
  const [failReason, setFailReason] = useState<'TIME' | 'LIVES' | null>(null);

  const handleLogin = useCallback((profile: UserProfile) => {
    setUser(profile);
  }, []);

  const handleStartGame = (levelId: number) => {
    setActiveLevelId(levelId);
    setFailReason(null);
    setScreen(ScreenState.GAME);
  };

  const handleGameComplete = (baseScore: number, timeRemaining: number, livesRemaining: number) => {
    const timeBonus = Math.floor(timeRemaining * 10);
    const lifeBonus = livesRemaining * 100;
    const finalScore = baseScore + timeBonus + lifeBonus;
    
    const target = LEVELS.find(l => l.id === activeLevelId)?.targetScore || 100;
    let stars = 1;
    if (finalScore >= target * 1.5) stars = 3;
    else if (finalScore >= target * 1.2) stars = 2;

    const currentStars = progress[activeLevelId]?.stars || 0;
    const isFirstClear = currentStars === 0;
    const gemsEarned = isFirstClear ? stars * 10 : 0;
    
    const newStats = StorageService.updateUserStats('guest', finalScore, gemsEarned);
    const newProgress = StorageService.saveLevelResult('guest', activeLevelId, stars, finalScore);
    
    setUserStats(newStats);
    setProgress(newProgress);
    
    if (!adsRemoved && Math.random() > 0.5) {
      setShowInterstitial(true);
    }
    
    setScreen(ScreenState.RESULT);
  };

  const handleFail = (reason?: 'TIME' | 'LIVES') => {
    setFailReason(reason || null);
    setScreen(ScreenState.FAIL);
  };

  const handleRewardGems = () => {
    const newStats = StorageService.updateUserStats('guest', 0, 30);
    setUserStats(newStats);
    setShowRewarded(false);
  };

  const handleNextStage = () => {
    if (activeLevelId < 100) {
      handleStartGame(activeLevelId + 1);
    } else {
      setScreen(ScreenState.LEVEL_SELECT);
    }
  };

  const activeLevelData = LEVELS.find(l => l.id === activeLevelId);

  return (
    <div className="h-screen w-full bg-[#0f172a] text-white overflow-hidden relative">
      {/* 
        [구조 변경] 
        전역 고정 HUD를 제거했습니다. 
        대신 MenuScreen과 LevelSelectScreen 내부 헤더에 스탯 정보를 직접 통합하여 배치합니다.
      */}

      {screen === ScreenState.MENU && (
        <MenuScreen 
          onStart={() => setScreen(ScreenState.LEVEL_SELECT)}
          onRemoveAds={() => {
            StorageService.removeAds();
            setAdsRemoved(true);
          }}
          adsRemoved={adsRemoved}
          user={user}
          // userStats={userStats}
          onLogin={handleLogin}
        />
      )}

      {screen === ScreenState.LEVEL_SELECT && (
        <LevelSelectScreen 
          progress={progress}
          userStats={userStats}
          onSelectLevel={handleStartGame}
          onBack={() => setScreen(ScreenState.MENU)}
          onWatchAd={() => setShowRewarded(true)}
        />
      )}

      {(screen === ScreenState.GAME || screen === ScreenState.FAIL) && activeLevelData && (
        <GameScreen 
          key={`level-${activeLevelId}-status-${screen}`}
          level={activeLevelData}
          onComplete={handleGameComplete}
          onFail={handleFail}
          onQuit={() => setScreen(ScreenState.LEVEL_SELECT)}
          reviveTrigger={reviveTrigger}
          currentGems={userStats.gems}
        />
      )}

      {screen === ScreenState.RESULT && (
        <div className="absolute inset-0 bg-slate-900/98 z-[100] flex flex-col items-center justify-center p-8 text-center animate-in">
          <h2 className="text-amber-400 text-6xl font-black italic tracking-tighter mb-6 drop-shadow-2xl">LEVEL CLEAR!</h2>
          <div className="flex gap-4 mb-12 text-6xl text-amber-400 drop-shadow-[0_0_20px_rgba(251,191,36,0.5)]">
            {Array.from({ length: 3 }).map((_, i) => <span key={i}>★</span>)}
          </div>
          <div className="w-full max-w-xs space-y-4">
            <button onClick={handleNextStage} className="w-full py-6 bg-amber-500 text-slate-900 font-black rounded-[2rem] text-2xl shadow-[0_8px_0_rgb(180,130,10)] active:translate-y-1 active:shadow-none transition-all">
              NEXT STAGE
            </button>
            <button onClick={() => setScreen(ScreenState.LEVEL_SELECT)} className="w-full py-4 text-slate-500 font-bold hover:text-white transition-all text-sm uppercase tracking-widest">
              Back to Menu
            </button>
          </div>
        </div>
      )}

      {screen === ScreenState.FAIL && (
        <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm z-[100] flex flex-col items-center justify-center p-8 text-center animate-in">
          <div className="text-8xl mb-6">{failReason === 'TIME' ? '⏰' : '💀'}</div>
          <h2 className="text-rose-500 text-6xl font-black italic tracking-tighter mb-4">
            {failReason === 'TIME' ? 'TIME UP' : 'OUT OF LIVES'}
          </h2>
          <p className="text-slate-400 mb-12 font-bold text-lg uppercase tracking-widest">
            {failReason === 'TIME' ? 'Need more time?' : 'Need a second chance?'}
          </p>
          <div className="flex flex-col gap-4 w-full max-w-xs">
            <button 
              onClick={() => {
                if (userStats.gems >= 100) {
                  const s = StorageService.updateUserStats('guest', 0, -100);
                  setUserStats(s);
                  setReviveTrigger(v => v + 1);
                  setScreen(ScreenState.GAME);
                } else {
                  alert("Not enough gems! 💎");
                }
              }}
              className="py-6 bg-sky-500 text-white font-black rounded-[2rem] text-2xl shadow-[0_8px_0_rgb(14,116,144)] flex flex-col items-center justify-center active:translate-y-1 active:shadow-none transition-all"
            >
              <div className="flex items-center gap-3">
                <span>{failReason === 'TIME' ? '+10 SECONDS' : '+1 LIFE'}</span>
                <div className="bg-black/20 px-3 py-1 rounded-full flex items-center gap-1 text-sm font-black">💎 100</div>
              </div>
            </button>
            <button onClick={() => setScreen(ScreenState.LEVEL_SELECT)} className="py-4 text-slate-500 font-bold hover:text-rose-400 uppercase tracking-widest">
              Give Up
            </button>
          </div>
        </div>
      )}

      <BannerAd isVisible={!adsRemoved && (screen === ScreenState.MENU || screen === ScreenState.LEVEL_SELECT)} />
      <InterstitialAd show={showInterstitial} onClose={() => setShowInterstitial(false)} />
      <RewardedAd show={showRewarded} onReward={handleRewardGems} onCancel={() => setShowRewarded(false)} />
    </div>
  );
}