import { formatNumber, formatPerformance } from '@Core/Embeds';
import { IManiaPerformance } from '@Core/REST';
import { BeatmapEmbed } from './BeatmapEmbed';

export class ManiaBeatmapEmbed extends BeatmapEmbed {
  protected _getStatsDetails(): string {
    const general = this._beatmap.general;

    const values = [
      `**Keys:** ${formatNumber(general.circleSize, 0)}`,
      `**OD:** ${formatNumber(general.overallDifficulty)}`,
      `**HP:** ${formatNumber(general.drainRate)}`,
    ];

    return values.join(' ⦁ ');
  }

  protected _getPerformanceValues(): string[][] {
    const pp = this._beatmap.performance as IManiaPerformance[];
    const f = formatPerformance;

    return [
      ['Strain', ...pp.map((a) => f(a.difficultyPerformance, true))],
    ];
  }
}
