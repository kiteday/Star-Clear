import React, { useEffect, useCallback } from 'react';
import { AdMob, BannerAdPosition, BannerAdSize, BannerAdPluginEvents } from '@capacitor-community/admob';
import { Capacitor } from '@capacitor/core';

/**
 * .env 파일의 환경 변수를 사용하도록 설정
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

// 현재 기기 플랫폼 확인 (iOS / Android / Web)
const platform = Capacitor.getPlatform() as 'ios' | 'android' | 'web';

const getAdId = (type: keyof typeof ADMOB_IDS) => {
  return platform === 'web' ? '' : ADMOB_IDS[type][platform];
};

/**
 * 1. 배너 광고 (Banner Ad)
 * 실제 광고는 SDK가 별도 레이어로 띄우므로, UI 컴포넌트 내부에서 SDK를 제어합니다.
 */
interface BannerAdProps {
  isVisible: boolean;
}

const getRewardedId = () => {
  const platform = Capacitor.getPlatform(); // 'ios' 또는 'android' 반환
  return platform === 'ios' ? ADMOB_IDS.REWARDED.ios : ADMOB_IDS.REWARDED.android;
};

export const BannerAd: React.FC<BannerAdProps> = ({ isVisible }) => {
  useEffect(() => {
    const showBanner = async () => {
      if (isVisible && platform !== 'web') {
        await AdMob.showBanner({
          adId: getAdId('BANNER'),
          adSize: BannerAdSize.ADAPTIVE_BANNER,
          position: BannerAdPosition.BOTTOM_CENTER,
          margin: 0,
        //   // 아이폰 노치(SafeArea) 대응을 위한 설정
        //   isOffshore: true 
        });
      } else {
        await AdMob.hideBanner();
      }
    };

    showBanner();
    
    // 컴포넌트가 사라질 때 배너 숨김
    return () => {
      if (platform !== 'web') AdMob.hideBanner();
    };
  }, [isVisible]);

  return null; // 배너는 네이티브 레이어에서 뜨므로 React UI는 필요 없음
};

/**
 * 2. 전면 광고 (Interstitial Ad)
 */
interface InterstitialAdProps {
  show: boolean;
  onClose: () => void;
}

export const InterstitialAd: React.FC<InterstitialAdProps> = ({ show, onClose }) => {
  useEffect(() => {
    if (show && platform !== 'web') {
      const runInterstitial = async () => {
        await AdMob.prepareInterstitial({ adId: getAdId('INTERSTITIAL') });
        await AdMob.showInterstitial();
        onClose(); // 광고 닫히면 부모 상태 초기화
      };
      runInterstitial().catch(onClose);
    }
  }, [show, onClose]);

  return null;
};

/**
 * 3. 보상형 광고 (Rewarded Ad) - 부활/시간연장 로직용
 */
interface RewardedAdProps {
  show: boolean;
  onReward: () => void;
  onCancel: () => void;
}

export const RewardedAd = ({ show, onReward, onCancel }: any) => {
  
  // 광고를 미리 다운로드하는 함수를 별도로 만듭니다.
  const prepareNextAd = useCallback(async () => {
    const platform = Capacitor.getPlatform();
    const adId = platform === 'ios' ? ADMOB_IDS.REWARDED.ios : ADMOB_IDS.REWARDED.android;

    try {
      await AdMob.prepareRewardVideoAd({ adId });
      console.log("다음 보상형 광고 준비 완료");
    } catch (e) {
      console.error("광고 준비 실패:", e);
    }
  }, []);

  // 1. 처음 앱 켰을 때 첫 번째 광고 준비
  useEffect(() => {
    prepareNextAd();
  }, [prepareNextAd]);

  // 2. 광고 재생 로직
  useEffect(() => {
    if (show) {
      const runAd = async () => {
        try {
          const reward = await AdMob.showRewardVideoAd();
          // 광고를 보여줬으니, 다음 광고를 미리 준비합니다.
          await prepareNextAd(); 

          if (reward && reward.amount > 0) {
            onReward(); // 실제 보상 지급 로직 실행
          } else {
            onCancel();
          }
        } catch (e) {
          console.error("광고 재생 실패:", e);
          onCancel();
          // 재생 실패 시에도 다음 기회를 위해 다시 준비
          await prepareNextAd(); 
        }
      };
      runAd();
    }
  }, [show, onCancel, prepareNextAd]);

  return null;
};


// export const RewardedAd: React.FC<RewardedAdProps> = ({ show, onReward, onCancel }) => {
//   useEffect(() => {
//     if (show && platform !== 'web') {
//       const runRewarded = async () => {
//         try {
//           // 1. 광고 준비
//           await AdMob.prepareRewardVideoAd({ adId: getAdId('REWARDED') });
          
//           // 2. 광고 실행 및 리스너 등록
//           const reward = await AdMob.showRewardVideoAd();
          
//           if (reward && reward.amount > 0) {
//             onReward(); // 실제 보상 지급 로직 실행
//           } else {
//             onCancel();
//           }
//         } catch (error) {
//           console.error('AdMob Error:', error);
//           onCancel();
//         }
//       };

//       runRewarded();
//     } else if (show && platform === 'web') {
//       // 웹 테스트 시에는 1초 후 바로 보상 지급 (개발 편의성)
//       setTimeout(() => {
//         alert("Web Test: Reward Granted!");
//         onReward();
//       }, 1000);
//     }
//   }, [show]);

//   return null;
// };