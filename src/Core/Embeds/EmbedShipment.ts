import {
  ButtonInteraction,
  Message,
  MessageAttachment,
  MessageEmbed,
} from 'discord.js';

import { ButtonSystem } from './ButtonSystem';

export class EmbedShipment {
  private readonly MIN_TRACKING_TIME = 5000;
  private readonly MAX_TRACKING_TIME = 600000;

  private _originalMessage: Message;
  private _buttonSystem?: ButtonSystem;
  private _embeds?: MessageEmbed[];
  private _attachments?: MessageAttachment[];
  private _trackingTime = 60000;
  private _autoDelete = false;

  constructor(message: Message) {
    this._originalMessage = message;
  }

  embeds(embeds: MessageEmbed | MessageEmbed[] | null): this {
    if (!embeds) return this;

    this._embeds = Array.isArray(embeds) ? embeds : [ embeds ];

    return this;
  }

  attachments(attachments: MessageAttachment | MessageAttachment[] | null): this {
    if (!attachments) return this;

    this._attachments = Array.isArray(attachments) ? attachments : [ attachments ];

    return this;
  }

  buttons(system: ButtonSystem): this {
    this._buttonSystem = system;

    return this;
  }

  trackingTime(time: number): this {
    const min = this.MIN_TRACKING_TIME;
    const max = this.MAX_TRACKING_TIME;

    this._trackingTime = Math.max(min, Math.min(time, max)) || max;

    return this;
  }

  autoDelete(state: boolean): this {
    this._autoDelete = state;

    return this;
  }

  async send(): Promise<Message> {
    const firstEmbed = this._embeds?.[0] ?? null;
    const embeds = [];

    if (firstEmbed) embeds.push(firstEmbed);

    const response = await this._originalMessage.channel.send({
      content: embeds.length ? '\u200b' : null,
      components: this._buttonSystem?.actionRows ?? [],
      files: this._attachments,
      embeds,
    });

    if (this._buttonSystem) {
      await this._executeButtonSystem(response);
    }

    return response;
  }

  async _executeButtonSystem(message: Message): Promise<void> {
    const filter = async(interaction: ButtonInteraction): Promise<boolean> => {
      await interaction.deferUpdate();

      return interaction.user.id === this._originalMessage.author.id;
    };

    const collector = await message.createMessageComponentCollector({
      idle: this._trackingTime,
      componentType: 'BUTTON',
      dispose: true,
      filter,
    });

    await this._buttonSystem?.execute(message, collector, this._autoDelete);
  }
}
