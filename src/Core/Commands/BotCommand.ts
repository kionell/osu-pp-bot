import { Permissions } from 'discord.js';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

import {
  Command,
  IFlag,
  IArgument,
  IHasFlags,
  IHasArgument,
} from 'cli-processor';

import { Category } from './Enums';

/**
 * A bot command.
 */
export abstract class BotCommand extends Command implements IHasFlags {
  /**
   * Example usage of this command.
   */
  examples: string[] = [];

  /**
   * Required permissions to use this command
   */
  permissions: Readonly<Permissions | null> = null;

  /**
   * Command category.
   */
  abstract category: Category;

  /**
   * Flags of this bot command.
   */
  flags = new Map<string, IFlag>();

  /**
   * Subcommands of this bot command.
   */
  subcommands = new Map<string, BotCommand>();

  /**
   * Adds a flag to the bot command.
   * @param flag The list of flags.
   */
  registerFlag(flag: IFlag): void {
    this.flags.set(flag.name, flag);
  }

  /**
   * Adds a subcommand to the bot command.
   * @param subcommand The list of flags.
   */
  registerSubcommand(subcommand: BotCommand): void {
    this.subcommands.set(subcommand.name, subcommand);
  }

  /**
   * Searches for an actual flag instance by a class.
   * @param Flag Flag class.
   * @returns Flag instance or null if not found.
   */
  findFlag<T extends IFlag>(Flag: new () => T): T | null {
    for (const entry of this.flags) {
      if (entry[1] instanceof Flag) return entry[1];
    }

    return null;
  }

  /**
   * Tries to get current value of specified argument.
   * @param arg Argument instance or null.
   * @returns Current value or null.
   */
  getValue<T extends IArgument>(arg: T | null): ReturnType<T['getValue']> {
    return (arg?.getValue() ?? null) as ReturnType<T['getValue']>;
  }

  /**
   * Searches for an actual flag instance by a class name and returns its value.
   * @param Flag Flag class.
   * @returns Current value or null.
   */
  getFlagValue<T extends IFlag & IHasArgument>(Flag: new() => T): ReturnType<T['arg']['getValue']> {
    const found = this.findFlag<IFlag & IHasArgument>(Flag);
    const flag = found ?? new Flag();

    return this.getValue<T['arg']>(flag.arg);
  }

  /**
   * Gets current or default value of specified argument.
   * @param arg Argument instance or null.
   * @returns Current or default value of the argument.
   */
  getValueOrDefault<T extends IArgument>(arg: T | null): ReturnType<T['getValueOrDefault']> {
    const value = arg?.getValueOrDefault() ?? String();

    return value as ReturnType<T['getValueOrDefault']>;
  }

  /**
   * Searches for an actual flag instance by a class name and returns its value.
   * @param Flag Flag class.
   * @returns Current or default value of the flag in this command instance.
   */
  getFlagValueOrDefault<T extends IFlag & IHasArgument>(Flag: new() => T): ReturnType<T['arg']['getValueOrDefault']> {
    const found = this.findFlag<IFlag & IHasArgument>(Flag);
    const flag = found ?? new Flag();

    return this.getValueOrDefault<T['arg']>(flag.arg);
  }

  /**
   * Tries to resolve absolute path from the current file to the target file.
   * @param fileURL Current file URL.
   * @param relativePath Relative path from the current file.
   * @returns The absolute path.
   */
  static getAbsolutePath(fileURL: string, relativePath: string): string {
    const __filename = fileURLToPath(fileURL);
    const __dirname = dirname(__filename);

    return resolve(__dirname, relativePath);
  }
}
