
import { type LevelDef } from '../gameTypes';

export const LEVELS: LevelDef[] = Array.from({ length: 100 }, (_, i) => {
  const levelNum = i + 1;
  const worldNum = Math.ceil(levelNum / 10); // 10개 월드, 각 월드당 10레벨
  const isBoss = levelNum % 10 === 0;
  
  // 난이도 상승 곡선 (i는 0~99)
  return {
    id: levelNum,
    world: worldNum,
    // 점수: 200부터 시작하여 레벨당 45점씩 상승
    targetScore: 200 + (i * 45) + (isBoss ? 300 : 0),
    // 시간: 60초에서 시작하여 최소 25초까지 감소
    timeLimit: Math.max(25, 60 - Math.floor(i / 3)),
    // 속도: 기존 2.0 base에서 3.5 base로, 증가폭도 0.06에서 0.12로 상향하여 훨씬 빠르게 조정
    fallSpeed: 3.5 + (i * 0.12),
    // 폭탄 확률: 5%에서 시작하여 최대 35%까지 상승
    bombChance: Math.min(0.35, 0.05 + (i * 0.003)),
    isBoss: isBoss
  };
});
