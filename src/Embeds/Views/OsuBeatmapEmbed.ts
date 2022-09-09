import { formatPerformance, formatStarRating } from '@Core/Embeds';
import { IOsuDifficulty, IOsuPerformance } from '@Core/REST';
import { BeatmapEmbed } from './BeatmapEmbed';

export class OsuBeatmapEmbed extends BeatmapEmbed {
  protected _getStatsDetails(): string {
    const general = this._beatmap.general;
    const difficulty = this._beatmap.difficulty as IOsuDifficulty;

    const values = [
      `**CS:** \`${general.circleSize.toFixed(2)}\``,
      `**AR:** \`${difficulty.approachRate.toFixed(2)}\``,
      `**OD:** \`${difficulty.overallDifficulty.toFixed(2)}\``,
      `**HP:** \`${difficulty.drainRate.toFixed(2)}\``,
    ];

    return values.join(' ⦁ ');
  }

  protected _getStarRatingDetails(): string {
    const difficulty = this._beatmap.difficulty as IOsuDifficulty;
    const prefix = super._getStarRatingDetails();

    const stars = [
      `**Aim:** ${formatStarRating(difficulty.aimStrain)}`,
      `**Speed:** ${formatStarRating(difficulty.speedStrain)}`,
    ];

    // This is a very simple way to split mod combination by two characters.
    if (difficulty.mods.indexOf('FL') % 2 === 0) {
      stars.push(`**FL:** \`${formatStarRating(difficulty.flashlightRating)}\``);
    }

    return `${prefix} (${stars.join(', ')})`;
  }

  protected _getPerformanceValues(): string[][] {
    const pp = this._beatmap.performance as IOsuPerformance[];
    const f = formatPerformance;

    const values = [
      ['Aim', ...pp.map((a) => f(a.aimPerformance, true))],
      ['Speed', ...pp.map((a) => f(a.speedPerformance, true))],
      ['Acc', ...pp.map((a) => f(a.accuracyPerformance, true))],
    ];

    const acronyms = this._beatmap.difficulty.mods.match(/.{1,2}/g);

    if (acronyms?.includes('FL')) {
      values.push(['FL', ...pp.map((a) => f(a.flashlightPerformance, true))]);
    }

    values.push(['Total', ...pp.map((a) => f(a.totalPerformance, true))]);

    return values;
  }
}
