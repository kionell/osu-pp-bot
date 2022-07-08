import {
  CommandParser,
  ICommand,
} from 'cli-processor';

import {
  ICommandOptions,
  BotCommand,
  Category,
} from '@Core/Commands';

import { ExtendedEmbed } from '@Core/Embeds';
import { EmbedFactory, GeneralHelpEmbed } from '@Embeds';
import { CommandArgument } from '@Options';

export class HelpCommand extends BotCommand {
  name = 'help';

  aliases = [
    'h',
  ];

  title = 'Help command';

  description = 'Gives you information about a command or subcommand';

  category = Category.Information;

  constructor() {
    super();

    this.addOption(new CommandArgument());
  }

  async execute(options: ICommandOptions): Promise<void> {
    const targetCommand = this.getValue(CommandArgument);

    const embed = targetCommand
      ? this._getCommandHelpEmbed(targetCommand, options)
      : this._getGeneralHelpEmbed(options);

    if (!embed) return;

    await this._getEmbedShipment(options)
      .embeds(await embed.build())
      .send();
  }

  protected _getCommandHelpEmbed(target: string, options: ICommandOptions): ExtendedEmbed {
    const commands = options.bot.commands;

    const parser = new CommandParser({
      commandList: commands,
      throwError: false,
    });

    const data = parser.parse(target);
    const last = data.tree.last as ICommand;

    /**
     * When command parser builds a command tree, it creates a copy 
     * of a command and replaces original flags with parsed flags.
     * We need to get original flags to display them on embed. 
     */
    if (last?.options) {
      const Command = last.constructor as new () => typeof last;

      last.options = new Command().options;
    }

    return EmbedFactory.createCommandHelpEmbed(data);
  }

  protected _getGeneralHelpEmbed(options: ICommandOptions): GeneralHelpEmbed {
    return EmbedFactory.createGeneralHelpEmbed(options);
  }
}
