import { EmbedField, MessageEmbedAuthor, MessageEmbedFooter } from 'discord.js';
import { ExtendedEmbed, formatCategoryName, getCategoryEmoji } from '@Core/Embeds';
import { BotCommand, ICommandOptions } from '@Core/Commands';

export class GeneralHelpEmbed extends ExtendedEmbed {
  constructor(protected _options: ICommandOptions) {
    super();
  }

  protected _createEmbedAuthor(): MessageEmbedAuthor {
    return {
      name: 'General help for osu! pp bot',
      iconURL: this._options.bot.user?.displayAvatarURL(),
    };
  }

  protected _createEmbedDescription(): string {
    return [
      'This bot is an advanced osu! performance calculator which is based on osu!lazer and written entirely in TypeScript.',
      'The main advantage of this bot over the rest osu! bots is that it fully supports converted and unsubmitted beatmaps!',
    ].join(' ');
  }

  protected _createEmbedFields(): EmbedField[] {
    const { commands } = this._options.bot;

    const output: BotCommand[][] = [];

    commands.forEach((c) => (output[c.category] ||= []).push(c));

    return output
      .filter((x) => x?.length > 0)
      .map((c) => this._createCategoryField(c));
  }

  protected _createCategoryField(commands: BotCommand[]): EmbedField {
    const categoryIndex = commands[0].category;

    const categoryName = formatCategoryName(categoryIndex);
    const categoryEmoji = getCategoryEmoji(categoryIndex);

    return {
      name: `${categoryEmoji} ${categoryName}`,
      value: commands.map((c) => '`' + c.name + '`').join(', '),
      inline: false,
    };
  }

  protected _createEmbedFooter(): MessageEmbedFooter {
    const { server } = this._options.cachedChannel;

    const prefix = server?.prefix ?? process.env.DEFAULT_PREFIX;
    const example = `\`${prefix}help <command>\``;

    return {
      text: `To get additional help for a specific command type ${example}`,
    };
  }
}
