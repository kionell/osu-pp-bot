import {
  Argument,
  CommandParser,
  type IHasArgument,
  type ICommand,
  type IHasFlags,
} from 'cli-processor';

import {
  type ICommandOptions,
  BotCommand,
} from '@Core/Commands';

import { EmbedShipment, ExtendedEmbed } from '@Core/Embeds';
import { EmbedFactory } from '@Embeds';

export class HelpCommand extends BotCommand implements IHasArgument {
  name = 'help';

  aliases = [
    'h',
  ];

  examples = [
    `${this.name} beatmap`,
    `${this.name} score`,
  ];

  title = 'Help command';

  description = 'Gives you information about a command or subcommand';

  arg = new Argument<string>({
    description: 'command line',
    isRequired: false,
    maxLength: Infinity,
  });

  async execute(options: ICommandOptions): Promise<void> {
    const targetCommand = this.getValue(this.arg);

    if (!targetCommand) {
      await this._getGeneralHelpEmbed(options);
    }

    const embed = targetCommand
      ? this._getCommandHelpEmbed(targetCommand, options)
      : null;

    const shipment = new EmbedShipment(options.msg);

    if (embed) {
      await shipment.embeds(await embed.build()).send();
    }
  }

  protected _getCommandHelpEmbed(target: string, options: ICommandOptions): ExtendedEmbed {
    const commands = options.bot.commands;

    const parser = new CommandParser({
      commandList: commands,
      throwError: false,
    });

    const data = parser.parse(target);
    const last = data.tree.last as ICommand & IHasFlags;

    /**
     * When command parser builds a command tree, it creates a copy 
     * of a command and replaces original flags with parsed flags.
     * We need to get original flags to display them on embed. 
     */
    if (last?.flags) {
      const Command = last.constructor as new () => typeof last;

      last.flags = new Command().flags;
    }

    return EmbedFactory.createCommandHelpEmbed(data);
  }

  protected async _getGeneralHelpEmbed(options: ICommandOptions): Promise<void> {
    // TODO: Finish this embed.
    await options.msg.channel.send('Add this embed already, omg... <@206094794395484160> <:Bonk:979419291705286657>');

    // return EmbedFactory.createGeneralHelpEmbed(options.bot.commands);
  }
}
