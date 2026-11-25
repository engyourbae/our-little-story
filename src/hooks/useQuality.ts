import { useGame } from '../store/gameStore';

export interface QualityCfg { shadows: boolean; shadowMap: number; dpr: number; flowers: number; butterflies: number; sparkles: number; stars: number; pointLights: boolean }
const Q: Record<string, QualityCfg> = {
  low: { shadows: false, shadowMap: 512, dpr: 1, flowers: 70, butterflies: 2, sparkles: 12, stars: 600, pointLights: false },
  medium: { shadows: true, shadowMap: 1024, dpr: 1.5, flowers: 160, butterflies: 4, sparkles: 30, stars: 1200, pointLights: false },
  high: { shadows: true, shadowMap: 2048, dpr: 2, flowers: 300, butterflies: 7, sparkles: 60, stars: 2500, pointLights: true }
};
export function useQuality(): QualityCfg {
  const q = useGame((s) => s.save.settings.quality);
  return Q[q] ?? Q.medium;
}
