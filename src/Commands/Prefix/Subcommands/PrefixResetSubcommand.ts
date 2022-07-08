import { BotCommand, Category, ICommandOptions } from '@Core/Commands';
import { RESTClient } from '@Core/REST';

export class PrefixResetSubcommand extends BotCommand {
  name = 'reset';

  title = 'Prefix reset command';

  description = 'Resets custom prefix on a server.';

  category = Category.Utility;

  async execute({ cachedChannel, msg, interaction }: ICommandOptions): Promise<void> {
    if (!cachedChannel.server) {
      throw new Error('Prefixes are not supported in direct messages!');
    }

    cachedChannel.server.prefix = null;

    await RESTClient.upsertDiscordChannel(cachedChannel);

    const answer = msg?.channel.send ?? interaction?.followUp;

    await answer?.('Prefix on the server has been reset to default.');
  }
}
