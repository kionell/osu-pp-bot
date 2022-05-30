import { Message } from 'discord.js';

import {
  CommandData,
  CommandParser,
  ICommand,
} from 'cli-processor';

import { IDiscordChannelResponse } from '@Core/REST';
import { Bot } from '@Core/Bot';
import { ModsFlag } from '@Flags';
import { Handler } from './Handler';

export class MessageCommandHandler extends Handler {
  async handleMessage(msg: Message, channel: IDiscordChannelResponse): Promise<boolean> {
    const bot = msg.client as Bot;
    const prefix = channel.server?.prefix ?? process.env.DEFAULT_PREFIX;

    const data = await this._getCommandData(bot.commands, msg, prefix);

    await data.execute?.({ data, msg, bot, channel });

    return data.isValid;
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
      .map((arg) => this._preprocessArg(arg))
      .filter((x) => x)
      .join(' ');
  }

  protected _preprocessArg(arg: string): string {
    if (arg.startsWith('+')) {
      return this._convertMods(arg);
    }

    return arg;
  }

  /**
   * Converts mods to a flag.
   * @param mods Raw mods started with '+' sign.
   * @returns Stringified mods flag.
   */
  private _convertMods(mods: string): string {
    const acronyms = mods.substring(1);
    const targetMods = acronyms;

    if (targetMods === null) return '';

    return `--${ModsFlag.globalName} ${targetMods}`;
  }
}
