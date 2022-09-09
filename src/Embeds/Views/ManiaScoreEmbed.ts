import { IManiaPerformance } from '@Core/REST';
import { formatCombo, formatPerformance } from '@Core/Embeds';
import { ScoreEmbed } from './ScoreEmbed';

export class ManiaScoreEmbed extends ScoreEmbed {
  protected _getComboDetails(): string {
    const { maxCombo, statistics } = this._score;

    const combo = formatCombo(maxCombo);

    const marvelous = statistics.countGeki;
    const perfect = statistics.count300;

    if (perfect) {
      const ratio = (marvelous / perfect).toFixed(2);

      return `${combo} (${ratio})`;
    }

    return combo;
  }

  protected _getPerformanceDetails(): string {
    const performance = this._score.performance as IManiaPerformance;

    const base = super._getPerformanceDetails();

    const separated = [
      `**Strain:** ${formatPerformance(performance.strainPerformance, true)}`,
      `**Acc:** ${formatPerformance(performance.accuracyPerformance, true)}`,
    ];

    return `${base} (${separated.join(', ')})`;
  }
}
