import { formatNumber } from '@Core/Embeds';
import { AttributesEmbed } from './AttributesEmbed';

export class OsuAttributesEmbed extends AttributesEmbed {
  protected _createEmbedDescription(): string {
    const {
      preempt,
      greatHitWindow,
      radius,
      approachRate,
      overallDifficulty,
      circleSize,
    } = this._attributes;

    const result: string[] = [];

    if (typeof approachRate === 'number' && typeof preempt === 'number') {
      result.push(`**Approach Rate**: ${formatNumber(approachRate)}`);
      result.push(`**Preempt**: ${formatNumber(preempt, 2, 'ms')}`);
    }

    if (typeof overallDifficulty === 'number' && typeof greatHitWindow === 'number') {
      result.push(`**Overall Difficulty**: ${formatNumber(overallDifficulty)}`);
      result.push(`**Great Hit Window**: ${formatNumber(greatHitWindow, 2, 'ms')}`);
    }

    if (typeof circleSize === 'number' && typeof radius === 'number') {
      result.push(`**Circle Size**: ${formatNumber(circleSize)}`);
      result.push(`**Circle Radius**: ${formatNumber(radius)}`);
    }

    return result.join('\n') || '*No attributes were calculated*';
  }
}
