import {
  ButtonInteraction,
  Message,
  MessageAttachment,
  MessageEmbed,
  CommandInteraction,
  Snowflake,
} from 'discord.js';

import { ButtonSystem } from './ButtonSystem';

export class EmbedShipment {
  private readonly MIN_TRACKING_TIME = 5000;
  private readonly MAX_TRACKING_TIME = 600000;

  private _msg?: Message;
  private _interaction?: CommandInteraction;
  private _buttonSystem?: ButtonSystem;
  private _embeds?: MessageEmbed[];
  private _attachments?: MessageAttachment[];
  private _trackingTime = 60000;
  private _autoDelete = false;

  message(msg: Message): this {
    this._msg = msg;

    return this;
  }

  interaction(interaction: CommandInteraction): this {
    this._interaction = interaction;

    return this;
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

  async send(): Promise<Message | null> {
    const reply = await this._getReplyMessage();

    if (!reply) return null;

    if (this._buttonSystem) {
      this._executeButtonSystem(reply);
    }

    return reply;
  }

  private async _getReplyMessage(): Promise<Message | null> {
    if (!this._msg && !this._interaction) return null;

    const firstEmbed = this._embeds?.[0] ?? null;
    const embeds = [];

    if (firstEmbed) embeds.push(firstEmbed);

    const payload = {
      content: embeds.length ? '\u200b' : null,
      components: this._buttonSystem?.actionRows ?? [],
      files: this._attachments,
      embeds,
    };

    if (this._msg) {
      return await this._msg.channel.send(payload);
    }

    const interaction = this._interaction as CommandInteraction;

    /**
     * Assume that we already defered our reply.
     */
    await interaction.editReply(payload);

    return await interaction.fetchReply() as Message;
  }

  private _executeButtonSystem(message: Message): void {
    const filter = async(interaction: ButtonInteraction): Promise<boolean> => {
      await interaction.deferUpdate();

      return interaction.user.id === this._getAuthorId();
    };

    const collector = message.createMessageComponentCollector({
      idle: this._trackingTime,
      componentType: 'BUTTON',
      dispose: true,
      filter,
    });

    this._buttonSystem?.execute(message, collector, this._autoDelete);
  }

  private _getAuthorId(): Snowflake | null {
    if (this._msg) return this._msg.author.id;
    if (this._interaction) return this._interaction.user.id;

    return null;
  }
}
