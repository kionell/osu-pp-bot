/**
 * Difficulty attributes of a beatmap.
 */
interface IDifficulty {
  mods: string;
  starRating: number;
  maxCombo: number;
}

/**
 * Difficulty attributes of an osu!std beatmap.
 */
export interface IOsuDifficulty extends IDifficulty {
  aimDifficulty: number;
  speedDifficulty: number;
  speedNoteCount: number;
  flashlightDifficulty: number;
  sliderFactor: number;
  approachRate: number;
  overallDifficulty: number;
  drainRate: number;
  hitCircleCount: number;
  sliderCount: number;
  spinnerCount: number;
}

/**
 * Difficulty attributes of an osu!taiko beatmap.
 */
export interface ITaikoDifficulty extends IDifficulty {
  staminaDifficulty: number;
  rhythmDifficulty: number;
  colourDifficulty: number;
  peakDifficulty: number;
  greatHitWindow: number;
}

/**
 * Difficulty attributes of an osu!catch beatmap.
 */
export interface ICatchDifficulty extends IDifficulty {
  approachRate: number;
}

/**
 * Difficulty attributes of an osu!mania beatmap.
 */
export interface IManiaDifficulty extends IDifficulty {
  greatHitWindow: number;
  scoreMultiplier: number;
}

/**
 * Possible difficulty attributes response from REST API.
 */
export type IDifficultyAttributes =
  IOsuDifficulty |
  ITaikoDifficulty |
  ICatchDifficulty |
  IManiaDifficulty;
