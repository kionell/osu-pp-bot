import { formatNumber, formatPerformance, formatStarRating } from '@Core/Embeds';
import { ITaikoDifficulty, ITaikoPerformance } from '@Core/REST';
import { BeatmapEmbed } from './BeatmapEmbed';

export class TaikoBeatmapEmbed extends BeatmapEmbed {
  protected _getStatsDetails(): string {
    const general = this._beatmap.general;

    const values = [
      `**OD:** ${formatNumber(general.overallDifficulty)}`,
      `**HP:** ${formatNumber(general.drainRate)}`,
    ];

    return values.join(' ⦁ ');
  }

  protected _getDifficultyDetails(): string {
    const {
      colourDifficulty,
      staminaDifficulty,
      rhythmDifficulty,
      peakDifficulty,
    } = this._beatmap.difficulty as ITaikoDifficulty;

    const prefix = super._getDifficultyDetails();
    const tooltipURL = this._message?.url;

    const stars = [
      `**Colour:** ${formatStarRating(colourDifficulty, tooltipURL)}`,
      `**Stamina:** ${formatStarRating(staminaDifficulty, tooltipURL)}`,
      `**Rhythm:** ${formatStarRating(rhythmDifficulty, tooltipURL)}`,
      `**Peaks:** ${formatStarRating(peakDifficulty, tooltipURL)}`,
    ];

    return `${prefix} (${stars.join(', ')})`;
  }

  protected _getPerformanceValues(): string[][] {
    const pp = this._beatmap.performance as ITaikoPerformance[];
    const f = formatPerformance;

    return [
      ['Strain', ...pp.map((a) => f(a.difficultyPerformance, true))],
      ['Acc', ...pp.map((a) => f(a.accuracyPerformance, true))],
      ['Total', ...pp.map((a) => f(a.totalPerformance, true))],
    ];
  }
}
