import { ICatchDifficulty } from '@Core/REST';
import { formatNumber } from '@Core/Embeds';
import { BeatmapEmbed } from './BeatmapEmbed';

export class CatchBeatmapEmbed extends BeatmapEmbed {
  protected _getStatsDetails(): string {
    const general = this._beatmap.general;
    const difficulty = this._beatmap.difficulty as ICatchDifficulty;

    const values = [
      `**CS:** ${formatNumber(general.circleSize)}`,
      `**AR:** ${formatNumber(difficulty.approachRate)}`,
      `**OD:** ${formatNumber(general.overallDifficulty)}`,
      `**HP:** ${formatNumber(general.drainRate)}`,
    ];

    return values.join(' ⦁ ');
  }
}
