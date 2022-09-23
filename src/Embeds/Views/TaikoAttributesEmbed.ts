import { formatNumber } from '@Core/Embeds';
import { AttributesEmbed } from './AttributesEmbed';

export class TaikoAttributesEmbed extends AttributesEmbed {
  protected _createEmbedDescription(): string {
    const { greatHitWindow, overallDifficulty } = this._attributes;

    const result: string[] = [];

    if (typeof overallDifficulty === 'number' && typeof greatHitWindow === 'number') {
      result.push(`**Overall Difficulty**: ${formatNumber(overallDifficulty)}`);
      result.push(`**Great Hit Window**: ${formatNumber(greatHitWindow)} ms`);
    }

    return result.join('\n') || '*No attributes were calculated*';
  }
}
