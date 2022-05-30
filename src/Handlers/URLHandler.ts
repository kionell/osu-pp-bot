import { Message } from 'discord.js';
import { CommandData, CommandParser } from 'cli-processor';
import { BotCommand } from '@Core/Commands';
import { MessageCommandHandler } from './MessageCommandHandler';
import { APIFactory, getServerName, URLScanner } from '@kionell/osu-api';

export abstract class URLHandler extends MessageCommandHandler {
  protected async _getCommandData(commands: Map<string, BotCommand>, msg: Message): Promise<CommandData> {
    const commandParser = new CommandParser({
      commandList: commands,
      allowTooManyArgs: true,
      throwError: false,
    });

    return commandParser.parse(this._simulateCommandLine(msg));
  }

  protected _preprocessArg(arg: string): string {
    arg = super._preprocessArg(arg);

    const serverName = getServerName(arg);
    const scanner = APIFactory.createURLScanner(serverName);

    if (this._isValidURL(arg, scanner)) {
      return this._convertURL(arg);
    }

    return arg;
  }

  /**
   * Converts URL to a part of command line.
   * @param url Target URL.
   * @returns Converted command line.
   */
  protected _convertURL(url: string): string {
    const command = this._getDefaultCommand();

    return `${command.name} ${url}`;
  }

  /**
   * @param url Target URL
   * @param scanner URL scanner for specific server.
   * @returns If this url is valid for this handler?
   */
  protected abstract _isValidURL(url: string, scanner: URLScanner): boolean;

  /**
   * @returns Default command that will be used to process this URL.
   */
  protected abstract _getDefaultCommand(): BotCommand;
}
