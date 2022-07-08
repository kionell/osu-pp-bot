import { fileURLToPath } from 'url';
import { dirname, relative } from 'path';

import {
  Client,
  Collection,
  ApplicationCommandOptionData,
  ApplicationCommandDataResolvable,
} from 'discord.js';

import glob from 'fast-glob';
import { DataType, ICommand, IOption } from 'cli-processor';
import { BotCommand } from './Commands';
import { BotEvent } from './Events';

/**
 * A discord bot.
 */
export abstract class Bot extends Client {
  /**
   * The collection of all available commands.
   */
  commands: Collection<string, BotCommand> = new Collection();

  /**
   * The token of this discord bot.
   */
  abstract token: string;

  /**
   * Relative path to the commands.
   */
  abstract commandsPath: string;

  /**
   * Relative path to the events.
   */
  abstract eventsPath: string;

  async init(): Promise<void> {
    await this.registerCommands();
    await this.registerEvents();

    this.login(this.token).catch(console.error);
  }

  async registerEvents(): Promise<void> {
    const paths = await this._getRelativeFilePaths(this.eventsPath);
    const classes = await this._getClassesFromPaths(paths);

    classes.forEach((entry) => {
      const constructor = entry as (new () => BotEvent);
      const event = (new constructor() as BotEvent);

      event.once
        ? this.once(event.name, event.handle)
        : this.on(event.name, event.handle);
    });
  }

  /**
   * Registering default commands.
   */
  async registerCommands(): Promise<void> {
    const paths = await this._getRelativeFilePaths(this.commandsPath);
    const classes = await this._getClassesFromPaths(paths);

    classes.forEach((entry) => {
      const constructor = entry as (new () => BotCommand);
      const command = (new constructor() as BotCommand);

      this.commands.set(command.name, command);
    });
  }

  /**
   * Registering slash commands.
   */
  async registerSlashCommands(): Promise<void> {
    const getDataType = (type: DataType) => {
      switch (type) {
        case DataType.Integer: return 'INTEGER';
        case DataType.Float: return 'NUMBER';
        case DataType.Boolean: return 'BOOLEAN';
        case DataType.String: return 'STRING';
        case DataType.Object: return 'ATTACHMENT';
      }
    };

    const createChoice = (choice: any) => {
      return {
        name: choice,
        value: choice,
      };
    };

    const createOption = (option: IOption) => {
      return {
        name: option.name,
        description: option.shortDescription || option.description,
        choices: option.choices.map(createChoice),
        type: getDataType(option.dataType),
      } as ApplicationCommandOptionData;
    };

    const createSubcommand = (command: ICommand) => {
      return {
        name: command.name,
        description: command.shortDescription || command.description,
        options: command.options.map(createOption),
        type: 'SUB_COMMAND',
      } as ApplicationCommandOptionData;
    };

    const createCommand = (command: ICommand) => {
      const subcommands = [];

      for (const subcommand of command.subcommands.values()) {
        subcommands.push(createSubcommand(subcommand));
      }

      return {
        name: command.name,
        description: command.shortDescription || command.description,
        options: [
          ...subcommands,
          ...command.options.map(createOption),
        ],
      } as ApplicationCommandDataResolvable;
    };

    for (const command of this.commands.values()) {
      await this.application?.commands.create(createCommand(command));
    }
  }

  private async _getClassesFromPaths(paths: string[]): Promise<(new () => unknown)[]> {
    const classes = [];

    for (const path of paths) {
      try {
        const module = await import(path);
        const entries = Object.values({ ...module }) as (new() => unknown)[];

        classes.push(...entries);
      }
      catch (err) {
        console.warn(`File cannot be loaded from path: ${path}. Reason: ${err}`);
        continue;
      }
    }

    return classes;
  }

  async _getRelativeFilePaths(relativePath: string): Promise<string[]> {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);

    const paths = await glob(`${relativePath}/**`, {
      objectMode: true,
      onlyFiles: false,
      absolute: true,
      cwd: 'build',
      deep: 1,
    });

    return paths
      .filter((x) => x.name.endsWith('.js') || !x.name.includes('.'))
      .map((x) => {
        const path = relative(__dirname, x.path).replace(/\\/g, '/');

        return path + (!x.name.includes('.') ? '/index.js' : '');
      });
  }
}
