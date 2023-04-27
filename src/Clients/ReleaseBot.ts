import { Bot } from '@Core/Bot';

/**
 * A bot client that will be used for production.
 */
export class ReleaseBot extends Bot {
  /**
   * A token of the release bot. 
   */
  token = process.env.PRODUCTION_DISCORD;

  /**
   * Relative path to the commands of release bot.
   */
  commandsPath = './Commands';

  /**
   * Relative path to the events of release bot.
   */
  eventsPath = './Events';
}
