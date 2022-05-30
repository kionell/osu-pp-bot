import { formatPerformance, formatStarRating } from '@Core/Embeds';
import { ITaikoDifficulty, ITaikoPerformance } from '@Core/REST';
import { BeatmapEmbed } from './BeatmapEmbed';

export class TaikoBeatmapEmbed extends BeatmapEmbed {
  protected _getStatsDetails(): string {
    const general = this._beatmap.general;

    const values = [
      `**OD:** \`${(general.overallDifficulty).toFixed(2)}\``,
      `**HP:** \`${(general.drainRate).toFixed(2)}\``,
    ];

    return values.join(' ⦁ ');
  }

  protected _getStarRatingDetails(): string {
    const difficulty = this._beatmap.difficulty as ITaikoDifficulty;
    const prefix = super._getStarRatingDetails();

    const stars = [
      `**Colour:** \`${formatStarRating(difficulty.colourStrain)}\``,
      `**Stamina:** \`${formatStarRating(difficulty.staminaStrain)}\``,
      `**Rhythm:** \`${formatStarRating(difficulty.rhythmStrain)}\``,
    ];

    return `${prefix} (${stars.join(', ')})`;
  }

  protected _getPerformanceValues(): string[][] {
    const pp = this._beatmap.performance as ITaikoPerformance[];
    const f = formatPerformance;

    return [
      ['Strain', ...pp.map((a) => f(a.strainPerformance, true))],
      ['Acc', ...pp.map((a) => f(a.accuracyPerformance, true))],
      ['Total', ...pp.map((a) => f(a.totalPerformance, true))],
    ];
  }
}
