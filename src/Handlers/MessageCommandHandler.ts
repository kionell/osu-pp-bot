import { Message } from 'discord.js';

import {
  CommandData,
  CommandParser,
  ICommand,
} from 'cli-processor';

import { IChatChannelResponse } from '@Core/REST';
import { Bot } from '@Core/Bot';
import { ModsFlag } from '@Options';
import { Handler } from './Handler';

type ArgPreprocessorFn = (arg: string, i: number, args: string[]) => string;

export class MessageCommandHandler extends Handler {
  async handleMessage(msg: Message, cachedChannel: IChatChannelResponse): Promise<boolean> {
    const bot = msg.client as Bot;
    const guild = msg.guild;
    const member = msg.member;

    const prefix = cachedChannel.server?.prefix ?? process.env.DEFAULT_PREFIX;

    const data = await this._getCommandData(bot.commands, msg, prefix);

    if (!data.isValid) return false;

    /**
     * Simulate message typing if command is valid... 
     */
    await msg.channel.sendTyping();

    if (data.isValid && !this.checkPermissions(guild, member, data.tree)) {
      throw new Error('You don\'t have enough permissions for this command!');
    }

    await data.execute?.({ data, msg, bot, cachedChannel });

    return true;
  }

  protected async _getCommandData(commands: Map<string, ICommand>, msg: Message, prefix?: string): Promise<CommandData> {
    const parser = new CommandParser({
      commandPrefix: prefix,
      commandList: commands,
    });

    return parser.parse(this._simulateCommandLine(msg));
  }

  protected _simulateCommandLine(msg: Message): string {
    return msg.content
      .split(' ')
      .map(this._preprocessArg)
      .filter((x) => x)
      .join(' ');
  }

  protected _preprocessArg: ArgPreprocessorFn = (arg: string): string => {
    if (arg.startsWith('+')) {
      return this._convertMods(arg);
    }

    return arg;
  };

  /**
   * Converts mods to a flag.
   * @param mods Raw mods started with '+' sign.
   * @returns Stringified mods flag.
   */
  protected _convertMods(mods: string): string {
    const acronyms = mods.substring(1);
    const targetMods = acronyms;

    if (targetMods === null) return '';

    const flag = new ModsFlag();

    return `${flag.prefix}${flag.name} ${targetMods}`;
  }
}
