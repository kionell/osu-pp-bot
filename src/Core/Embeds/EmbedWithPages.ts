import { MessageEmbedFooter } from 'discord.js';
import { ExtendedEmbed } from './ExtendedEmbed';

/**
 * Embeds that can have pagination.
 */
export abstract class EmbedWithPages extends ExtendedEmbed {
  /**
   * Current page.
   */
  page = 1;

  /**
   * Total amount of pages.
   */
  pages = 1;

  protected _createEmbedFooter(): MessageEmbedFooter | null {
    const base = super._createEmbedFooter();
    const args = [];

    if (base?.text) args.push(base.text);

    args.push(`Page: ${this.page}/${this.pages}`);

    return {
      text: args.join(' ⦁ '),
      iconURL: base?.iconURL,
      proxyIconURL: base?.proxyIconURL,
    };
  }
}
