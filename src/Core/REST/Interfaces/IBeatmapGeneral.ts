/**
 * Base beatmap general attributes.
 */
interface IBaseBeatmapGeneral {
  length: number;
  bpmMin: number;
  bpmMax: number;
  bpmMode: number;
  circleSize: number;
  approachRate: number;
  overallDifficulty: number;
  drainRate: number;
  hittable: number;
  slidable: number;
  spinnable: number;
  holdable: number;
  maxCombo: number;
  totalHits: number;
}

/**
 * osu!catch beatmap general attributes.
 */
interface ICatchBeatmapGeneral extends IBaseBeatmapGeneral {
  maxFruits: number;
  maxDroplets: number;
  maxTinyDroplets: number;
}

/**
 * Beatmap general attributes response from REST API.
 */
export type IBeatmapGeneral = IBaseBeatmapGeneral | ICatchBeatmapGeneral;
