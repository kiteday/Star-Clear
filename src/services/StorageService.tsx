
import { type LevelProgress, type UserStats } from '../gameTypes';

const SAVE_PREFIX = 'star_clear_progress_';
const STATS_PREFIX = 'star_clear_stats_';

const safeLocalStorage = {
  getItem: (key: string) => {
    try {
      return localStorage.getItem(key);
    } catch (e) {
      return null;
    }
  },
  setItem: (key: string, value: string) => {
    try {
      localStorage.setItem(key, value);
    } catch (e) {
      console.warn('Storage error');
    }
  }
};

const getInitialProgress = (): Record<number, LevelProgress> => {
  const initial: Record<number, LevelProgress> = {};
  for (let i = 1; i <= 100; i++) {
    initial[i] = {
      stars: 0,
      unlocked: i === 1,
      highScore: 0
    };
  }
  return initial;
};

// [안내] 초기 보석 설정을 변경하시려면 아래 { totalPoints: 0, gems: 100 } 부분을 수정하세요.
export const getUserStats = (userId: string = 'guest'): UserStats => {
  const data = safeLocalStorage.getItem(STATS_PREFIX + userId);
  if (!data) return { totalPoints: 0, gems: 100 };
  try {
    const parsed = JSON.parse(data);
    return (parsed && typeof parsed === 'object') ? parsed : { totalPoints: 0, gems: 100 };
  } catch (e) {
    return { totalPoints: 0, gems: 100 };
  }
};

export const updateUserStats = (userId: string = 'guest', pointsToAdd: number, gemsToAdd: number) => {
  const stats = getUserStats(userId);
  stats.totalPoints += pointsToAdd;
  stats.gems += gemsToAdd;
  safeLocalStorage.setItem(STATS_PREFIX + userId, JSON.stringify(stats));
  return stats;
};

export const saveLevelResult = (userId: string = 'guest', levelId: number, stars: number, score: number) => {
  const progress = getProgress(userId);
  const current = progress[levelId];
  if (current) {
    progress[levelId] = {
      ...current,
      stars: Math.max(current.stars, stars),
      highScore: Math.max(current.highScore, score)
    };
    if (stars > 0 && levelId < 100 && progress[levelId + 1]) {
      progress[levelId + 1].unlocked = true;
    }
  }
  safeLocalStorage.setItem(SAVE_PREFIX + userId, JSON.stringify(progress));
  return progress;
};

export const getProgress = (userId: string = 'guest'): Record<number, LevelProgress> => {
  const data = safeLocalStorage.getItem(SAVE_PREFIX + userId);
  if (!data) return getInitialProgress();
  try {
    const parsed = JSON.parse(data);
    return (parsed && typeof parsed === 'object') ? parsed : getInitialProgress();
  } catch (e) {
    return getInitialProgress();
  }
};

export const isAdsRemoved = (): boolean => safeLocalStorage.getItem('star_clear_ads_removed') === 'true';
export const removeAds = () => safeLocalStorage.setItem('star_clear_ads_removed', 'true');
