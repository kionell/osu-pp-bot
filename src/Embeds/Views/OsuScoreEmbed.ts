import { formatPerformance } from '@Core/Embeds';
import { IOsuPerformance } from '@Core/REST';
import { ScoreEmbed } from './ScoreEmbed';

export class OsuScoreEmbed extends ScoreEmbed {
  protected _getPerformanceDetails(): string {
    const performance = this._score.performance as IOsuPerformance;

    const base = super._getPerformanceDetails();

    const separated = [
      `**Aim:** ${formatPerformance(performance.aimPerformance, true)}`,
      `**Speed:** ${formatPerformance(performance.speedPerformance, true)}`,
      `**Acc:** ${formatPerformance(performance.accuracyPerformance, true)}`,
    ];

    // This is a very simple way to split mod combination by two characters.
    if (performance.mods.indexOf('FL') % 2 === 0) {
      separated.push(`**FL:** ${formatPerformance(performance.flashlightPerformance, true)}`);
    }

    return `${base} (${separated.join(', ')})`;
  }
}
