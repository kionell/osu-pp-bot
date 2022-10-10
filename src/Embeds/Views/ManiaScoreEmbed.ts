import { IManiaPerformance } from '@Core/REST';
import { formatAccuracy, formatPerformance } from '@Core/Embeds';
import { ScoreEmbed } from './ScoreEmbed';

export class ManiaScoreEmbed extends ScoreEmbed {
  protected _getAccuracyDetails(): string {
    const { accuracy, statistics } = this._score;

    const formattedAccuracy = formatAccuracy(accuracy);

    const marvelous = statistics.countGeki;
    const perfect = statistics.count300;

    if (perfect) {
      const ratio = (marvelous / perfect).toFixed(2);

      return `${formattedAccuracy} (${ratio})`;
    }

    return formattedAccuracy;
  }

  protected _getPerformanceDetails(): string {
    const performance = this._score.performance as IManiaPerformance;

    const base = super._getPerformanceDetails();

    const separated = [
      `**Strain:** ${formatPerformance(performance.difficultyPerformance, true)}`,
    ];

    return `${base} (${separated.join(', ')})`;
  }
}
