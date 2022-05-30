import glob from 'fast-glob';
import { Client, Collection } from 'discord.js';
import { BotCommand } from './Commands';
import { BotEvent } from './Events';
import { fileURLToPath } from 'url';
import { dirname, relative } from 'path';

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
    await this._setCommands();
    await this._setEvents();

    this.login(this.token).catch(console.error);
  }

  private async _setEvents(): Promise<void> {
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

  private async _setCommands(): Promise<void> {
    const paths = await this._getRelativeFilePaths(this.commandsPath);
    const classes = await this._getClassesFromPaths(paths);

    classes.forEach((entry) => {
      const constructor = entry as (new () => BotCommand);
      const command = (new constructor() as BotCommand);

      this.commands.set(command.name, command);
    });
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
