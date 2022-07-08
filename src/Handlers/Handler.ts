import { Guild, GuildMember } from 'discord.js';
import { BotCommand } from '@Core/Commands';
import { CommandTree } from 'cli-processor';

export abstract class Handler {
  /**
   * @param guild Current guild.
   * @param member Current member.
   * @param tree Command tree.
   * @returns If message author has all required permissions.
   */
  checkPermissions(guild: Guild | null, member: GuildMember | null, tree: CommandTree): boolean {
    for (const command of tree) {
      /**
       * Skip commands that aren't supported by this bot.
       * Also, skip commands that don't require any permissions.
       */
      if (!(command instanceof BotCommand) || !command.permissions) continue;

      /**
       * We need to check permissions only if this bot is used on a server.
       */
      if (!guild || !member) continue;

      const required = command.permissions;
      const existing = member.permissions;

      return existing.missing(required.bitfield).length === 0;
    }

    return true;
  }
}
