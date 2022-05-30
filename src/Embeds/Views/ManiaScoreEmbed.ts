import { formatCombo } from '@Core/Embeds';
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
}
