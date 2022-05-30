import { ICatchDifficulty } from '@Core/REST';
import { BeatmapEmbed } from './BeatmapEmbed';

export class CatchBeatmapEmbed extends BeatmapEmbed {
  protected _getStatsDetails(): string {
    const general = this._beatmap.general;
    const difficulty = this._beatmap.difficulty as ICatchDifficulty;

    const values = [
      `**CS:** \`${(general.circleSize).toFixed(2)}\``,
      `**AR:** \`${(difficulty.approachRate).toFixed(2)}\``,
      `**OD:** \`${(general.overallDifficulty).toFixed(2)}\``,
      `**HP:** \`${(general.drainRate).toFixed(2)}\``,
    ];

    return values.join(' ⦁ ');
  }
}
