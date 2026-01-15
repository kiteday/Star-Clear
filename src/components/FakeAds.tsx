import React, { useState, useEffect } from 'react';

/**
 * [가이드] 구글 AdMob 테스트/실제 ID 관리
 */
const ADMOB_IDS = {
  BANNER: {
    android: import.meta.env.VITE_ANDROID_BANNER_ID,
    ios: import.meta.env.VITE_IOS_BANNER_ID,
  },
  INTERSTITIAL: {
    android: import.meta.env.VITE_ANDROID_INTERSTITIAL_ID,
    ios: import.meta.env.VITE_IOS_INTERSTITIAL_ID,
  },
  REWARDED: {
    android: import.meta.env.VITE_ANDROID_REWARDED_ID,
    ios: import.meta.env.VITE_IOS_REWARDED_ID,
  }
};

const IS_PRODUCTION = false; 

const getAdId = (type: keyof typeof ADMOB_IDS) => {
  return ADMOB_IDS[type].android;
};

interface BannerAdProps {
  isVisible: boolean;
}

export const BannerAd: React.FC<BannerAdProps> = ({ isVisible }) => {
  useEffect(() => {
    if (isVisible) {
      console.log(`[AdMob] Banner Active: ${getAdId('BANNER')}`);
    }
  }, [isVisible]);

  if (!isVisible) return null;
  
  // 시니어의 팁: 실제 앱 환경이 아닐 때는 광고 대신 빈 박스만 보여주게 설정합니다.
  // @ts-ignore
  const isMobileApp = window.hasOwnProperty('Capacitor'); 

  if (!isMobileApp) {
    return (
      <div className="fixed bottom-0 left-0 right-0 bg-slate-900 h-14 flex flex-col items-center justify-center z-[90] border-t border-slate-800">
        <div className="text-[8px] text-amber-500 font-black mb-1">
          {IS_PRODUCTION ? 'LIVE AD UNIT' : 'TEST AD UNIT (WEB)'}
        </div>
        <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest animate-pulse">
          [광고 테스트 영역]
        </div>
      </div>
    );
  }

  // 실제 모바일 앱일 때만 SDK 로직 실행 (추후 구현을 위한 플레이스홀더)
  return <div id="admob-banner-element" className="fixed bottom-0 left-0 right-0 h-14 bg-black z-[90]" />;
};

interface InterstitialAdProps {
  onClose: () => void;
  show: boolean;
}

export const InterstitialAd: React.FC<InterstitialAdProps> = ({ show, onClose }) => {
  useEffect(() => {
    if (show) {
      console.log(`[AdMob] Interstitial Triggered: ${getAdId('INTERSTITIAL')}`);
      const timer = setTimeout(onClose, 2000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black z-[200] flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mb-6"></div>
      <p className="text-white font-black text-xl italic mb-2 tracking-tighter tracking-widest">LOADING AD...</p>
      <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">AdMob Interstitial Test</p>
    </div>
  );
};

interface RewardedAdProps {
  show: boolean;
  onReward: () => void;
  onCancel: () => void;
}

export const RewardedAd: React.FC<RewardedAdProps> = ({ show, onReward, onCancel }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (show) {
      console.log(`[AdMob] Rewarded Ad Loading: ${getAdId('REWARDED')}`);
      if (progress < 100) {
        const t = setTimeout(() => setProgress(prev => prev + 2), 50);
        return () => clearTimeout(t);
      } else {
        onReward();
      }
    } else {
      setProgress(0);
    }
  }, [show, progress, onReward]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/95 backdrop-blur-2xl z-[210] flex flex-col items-center justify-center p-8">
      <div className="bg-slate-800 p-8 rounded-[3rem] border-4 border-sky-500 max-w-sm w-full text-center shadow-[0_0_50px_rgba(14,165,233,0.3)]">
        <div className="text-6xl mb-6">🎁</div>
        <h2 className="text-3xl font-black text-white mb-2 tracking-tight uppercase italic">Ad Reward</h2>
        <p className="text-slate-400 font-medium mb-8">Watching video for rewards...</p>
        
        <div className="relative w-full h-4 bg-slate-700 rounded-full mb-8 overflow-hidden">
          <div 
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-sky-400 to-indigo-500 transition-all duration-75"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        <button 
          onClick={onCancel}
          className="mt-4 py-3 px-6 text-slate-500 hover:text-rose-500 font-bold text-sm transition-colors uppercase tracking-widest"
        >
          Skip Ad
        </button>
      </div>
    </div>
  );
};