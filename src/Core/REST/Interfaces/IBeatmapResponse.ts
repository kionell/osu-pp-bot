import { IBeatmapGeneral } from './IBeatmapGeneral';
import { IBeatmapMetadata } from './IBeatmapMetadata';
import { IDifficultyAttributes } from './IDifficultyAttributes';
import { IPerformanceAttributes } from './IPerformanceAttributes';

/**
 * Beatmap response from REST API.
 */
export interface IBeatmapResponse {
  /**
   * Beatmap ID.
   */
  id: number;

  /**
   * Beatmap MD5 hash.
   */
  hash: string;

  /**
   * Beatmap mode.
   */
  rulesetId: number;

  /**
   * Beatmap mods.
   */
  mods: string;

  /**
   * Is beatmap converted or not?
   */
  isConvert: boolean;

  /**
   * Beatmap graph file name.
   */
  graphFile?: string;

  /**
   * Beatmap ruleset & mods specific information.
   */
  general: IBeatmapGeneral;

  /**
   * Beatmap metadata.
   */
  metadata: IBeatmapMetadata;

  /**
   * Beatmap difficulty attributes.
   */
  difficulty: IDifficultyAttributes;

  /**
   * List of beatmap performance attributes.
   */
  performance: IPerformanceAttributes[];
}
