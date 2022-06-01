import { Message } from 'discord.js';
import { BotCommand } from '@Core/Commands';

export abstract class Handler {
  /**
   * @param msg Current message.
   * @param command Target command.
   * @returns If message author has all required permissions.
   */
  checkPermissions(msg: Message, command: BotCommand): boolean {
    /**
     * Skip commands that aren't supported by this bot.
     */
    if (!(command instanceof BotCommand)) return false;

    /**
     * We need to check permissions only if this bot is used on a server.
     * Also, skip commands that don't require any permissions.
     */
    if (!msg.guild || !msg.member || !command.permissions) return true;

    const required = command.permissions;
    const existing = msg.member.permissions;

    return required.missing(existing.bitfield).length === 0;
  }
}
