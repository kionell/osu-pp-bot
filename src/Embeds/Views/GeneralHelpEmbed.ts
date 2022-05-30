import {
  EmbedField,
  MessageEmbedAuthor,
} from 'discord.js';

import {
  ExtendedEmbed,
} from '@Core/Embeds';

import { ICommand } from 'cli-processor';

export class GeneralHelpEmbed extends ExtendedEmbed {
  protected _commands: Map<string, ICommand>;

  constructor(commands: Map<string, ICommand>) {
    super();

    this._commands = commands;
  }

  protected _createEmbedTitle(): string | null {
    return null;
  }

  protected _createEmbedURL(): string | null {
    return null;
  }

  protected _createEmbedAuthor(): MessageEmbedAuthor {
    return {
      name: 'Created by',
      iconURL: '',
      url: '',
    };
  }

  protected _createEmbedFields(): EmbedField[] {
    return [];
  }
}
