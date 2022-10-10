/**
 * Performance attributes of a score.
 */
export interface IPerformance {
  mods: string;
  totalPerformance: number;
}

/**
 * Performance attributes of an osu!std score.
 */
export interface IOsuPerformance extends IPerformance {
  aimPerformance: number;
  speedPerformance: number;
  accuracyPerformance: number;
  flashlightPerformance: number;
  effectiveMissCount: number;
}

/**
 * Performance attributes of an osu!taiko score.
 */
export interface ITaikoPerformance extends IPerformance {
  difficultyPerformance: number;
  accuracyPerformance: number;
  effectiveMissCount: number;
}

/**
 * Performance attributes of an osu!mania score.
 */
export interface IManiaPerformance extends IPerformance {
  difficultyPerformance: number;
}

/**
 * Performance attributes of an osu!catch score.
 */
export type ICatchPerformance = IPerformance;

/**
 * Possible performance attributes response from REST API.
 */
export type IPerformanceAttributes =
  IOsuPerformance |
  ITaikoPerformance |
  ICatchPerformance |
  IManiaPerformance;
