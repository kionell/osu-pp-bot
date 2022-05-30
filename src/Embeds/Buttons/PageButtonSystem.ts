import { MessageButton, ButtonInteraction } from 'discord.js';
import { EmbedWithPages, ButtonSystem, Emoji } from '@Core/Embeds';

/**
 * Button system for messages that can have multiple embeds.
 */
export class PageButtonSystem extends ButtonSystem {
  private _embeds: EmbedWithPages[] = [];

  private _currentPage = 1;

  constructor(pageList: EmbedWithPages[]) {
    super();

    this._embeds = pageList;
  }

  /**
   * Buttons for messages that can have multiple embeds.
   */
  get buttons(): MessageButton[] {
    return [
      new MessageButton()
        .setStyle('SECONDARY')
        .setEmoji(Emoji.First)
        .setCustomId('firstPage'),

      new MessageButton()
        .setStyle('SECONDARY')
        .setEmoji(Emoji.Previous)
        .setCustomId('previousPage'),

      new MessageButton()
        .setStyle('SECONDARY')
        .setEmoji(Emoji.Next)
        .setCustomId('nextPage'),

      new MessageButton()
        .setStyle('SECONDARY')
        .setEmoji(Emoji.Last)
        .setCustomId('lastPage'),
    ];
  }

  get currentEmbed(): EmbedWithPages {
    return this._embeds[this.currentPage - 1];
  }

  get currentPage(): number {
    return this._currentPage;
  }

  set currentPage(page: number) {
    this._currentPage = Math.max(1, Math.min(page, this.totalPages)) || 1;
  }

  get totalPages(): number {
    return this._embeds.length;
  }

  async process(interaction: ButtonInteraction): Promise<void> {
    /**
     * We don't want to work with deleted messages.
     */
    if (!this.message?.deletable) return;

    /**
     * There is no sense to switch pages if there are only 1 page.
     */
    if (this.totalPages <= 1) return;

    this._currentPage += this._getPageOffset(interaction);

    this.currentPage = Math.max(0, Math.min(this.currentPage, this.totalPages));

    this.message
      .edit({
        embeds: [ this.currentEmbed ],
      })
      .then((edited) => {
        this.emit(interaction.customId, edited);
      })
      .catch(console.warn);
  }

  /**
   * Checks current button interaction to get page offset.
   * @param interaction Current button interaction.
   * @returns Page offset.
   */
  private _getPageOffset(interaction: ButtonInteraction): number {
    switch (interaction.customId) {
      case 'firstPage': return -this.currentPage;
      case 'previousPage': return -1;
      case 'nextPage': return 1;
      case 'lastPage': return this.totalPages - this.currentPage;
    }

    return 0;
  }
}
