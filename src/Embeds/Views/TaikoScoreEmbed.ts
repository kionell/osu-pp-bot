import { ITaikoPerformance } from '@Core/REST';
import { formatPerformance } from '@Core/Embeds';
import { ScoreEmbed } from './ScoreEmbed';

export class TaikoScoreEmbed extends ScoreEmbed {
  protected _getPerformanceDetails(): string {
    const performance = this._score.performance as ITaikoPerformance;

    const base = super._getPerformanceDetails();

    const separated = [
      `**Strain:** ${formatPerformance(performance.strainPerformance, true)}`,
      `**Acc:** ${formatPerformance(performance.accuracyPerformance, true)}`,
    ];

    return `${base} (${separated.join(', ')})`;
  }
}
