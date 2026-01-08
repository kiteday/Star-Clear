
export enum ScreenState {
  MENU = 'MENU',
  LEVEL_SELECT = 'LEVEL_SELECT',
  GAME = 'GAME',
  RESULT = 'RESULT',
  FAIL = 'FAIL'
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  picture: string;
}

export interface UserStats {
  totalPoints: number;
  gems: number;
}

export interface LevelProgress {
  stars: number;
  unlocked: boolean;
  highScore: number;
}

export interface LevelDef {
  id: number;
  world: number;
  targetScore: number;
  timeLimit: number;
  fallSpeed: number;
  bombChance: number;
  isBoss?: boolean;
}

export enum GameObjectType {
  STAR_GOLD,
  STAR_SILVER,
  BOMB,
  ITEM_TIME,
  ITEM_SHIELD
}

export interface GameObject {
  id: number;
  type: GameObjectType;
  x: number;
  y: number;
  radius: number;
  speed: number;
  opacity: number;
  isCaught: boolean;
  oscillation?: number;
}

export interface GameResult {
  levelId: number;
  stars: number;
  score: number;
  baseScore: number;
  timeBonus: number;
  lifeBonus: number;
  gemsEarned: number;
  isNewBest: boolean;
  reason?: 'TIME' | 'LIVES';
}

// export type {GameObject, GameResult, }