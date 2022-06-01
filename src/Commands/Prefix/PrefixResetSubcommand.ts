import { Permissions } from 'discord.js';
import { BotCommand, ICommandOptions } from '@Core/Commands';
import { RESTClient } from '@Core/REST';

export class PrefixResetSubcommand extends BotCommand {
  name = 'reset';

  title = 'Prefix reset command';

  description = 'Resets custom prefix on a server.';

  /**
   * This command requires admin permissions.
   */
  permissions = new Permissions(Permissions.FLAGS.ADMINISTRATOR);

  async execute({ channel, msg }: ICommandOptions): Promise<void> {
    if (!channel.server) {
      throw new Error('Prefixes are not supported in direct messages!');
    }

    channel.server.prefix = null;

    await RESTClient.upsertDiscordChannel(channel);

    await msg.channel.send('Prefix on the server has been reset to default.');
  }
}
