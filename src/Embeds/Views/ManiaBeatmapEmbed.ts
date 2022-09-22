import { formatNumber, formatPerformance, formatTotalScore } from '@Core/Embeds';
import { IManiaDifficulty, IManiaPerformance } from '@Core/REST';
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

  protected _getPerformanceTitles(): string[] {
    const difficulty = this._beatmap.difficulty as IManiaDifficulty;

    const values = [ 8e5, 9e5, 1e6 ].map((totalScore) => {
      return formatTotalScore(totalScore, difficulty.scoreMultiplier);
    });

    return ['Score', ...values];
  }

  protected _getPerformanceValues(): string[][] {
    const pp = this._beatmap.performance as IManiaPerformance[];
    const f = formatPerformance;

    return [
      ['Strain', ...pp.map((a) => f(a.strainPerformance, true))],
      ['Acc', ...pp.map((a) => f(a.accuracyPerformance, true))],
      ['Total', ...pp.map((a) => f(a.totalPerformance, true))],
    ];
  }
}
