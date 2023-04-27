import { Bot } from '@Core/Bot';

/**
 * A bot client that will be used for debugging purposes.
 */
export class DebugBot extends Bot {
  /**
   * A token of the debug bot. 
   */
  token = process.env.DEBUG_DISCORD;

  /**
   * Relative path to the commands of debug bot.
   */
  commandsPath = './Commands';

  /**
   * Relative path to the events of debug bot.
   */
  eventsPath = './Events';
}
