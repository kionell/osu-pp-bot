import { GuildMember, CommandInteraction, CommandInteractionOption } from 'discord.js';
import { CommandData, CommandParser, ICommand } from 'cli-processor';
import { InteractionHandler } from './InteractionHandler';
import { IChatChannelResponse } from '@Core/REST';
import { Bot } from '@Core/Bot';

export class ApplicationCommandHandler extends InteractionHandler {
  async handleInteraction(interaction: CommandInteraction, cachedChannel: IChatChannelResponse): Promise<any> {
    await interaction.deferReply();

    const bot = interaction.client as Bot;
    const guild = interaction.guild;
    const member = interaction.member as GuildMember;

    const data = await this._getCommandData(bot.commands, interaction);

    if (!data.isValid) return false;

    if (data.isValid && !this.checkPermissions(guild, member, data.tree)) {
      throw new Error('You don\'t have enough permissions for this command!');
    }

    await data.execute?.({ data, interaction, bot, cachedChannel });

    return true;
  }

  protected async _getCommandData(commands: Map<string, ICommand>, interaction: CommandInteraction): Promise<CommandData> {
    const parser = new CommandParser({
      commandList: commands,
    });

    return parser.parse(this._convertInteractionToCommandLine(commands, interaction));
  }

  /**
   * Converts discord application command to CLI command line.
   * @param commands Command list.
   * @param interaction Command interaction.
   * @returns Converted command line.
   */
  protected _convertInteractionToCommandLine(commands: Map<string, ICommand>, interaction: CommandInteraction): string {
    const command = commands.get(interaction.commandName);

    if (!command) return '';

    const convertOption = (original: CommandInteractionOption) => {
      const option = command.getOptionByName(original.name);

      return [ option?.toString() ?? '', original.value ].join(' ');
    };

    return [
      command.name,
      ...interaction.options.data.map(convertOption),
    ].join(' ');
  }
}
