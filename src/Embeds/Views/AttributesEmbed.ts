import { ExtendedEmbed, getRulesetIconURL } from '@Core/Embeds';
import { MessageEmbedAuthor } from 'discord.js';

export interface IOutputAttributes {
  mods: string;
  clockRate: number;
  rulesetId?: number;
  approachRate?: number;
  preempt?: number;
  circleSize?: number;
  radius?: number;
  overallDifficulty?: number;
  greatHitWindow?: number;
}

export abstract class AttributesEmbed extends ExtendedEmbed {
  constructor(protected _attributes: IOutputAttributes) {
    super();
  }

  protected _createEmbedAuthor(): MessageEmbedAuthor {
    const { mods, clockRate, rulesetId } = this._attributes;

    return {
      name: `Attributes for ${mods} [${clockRate.toFixed(2)}x]`,
      iconURL: getRulesetIconURL(rulesetId),
    };
  }

  protected abstract _createEmbedDescription(): string;
}
