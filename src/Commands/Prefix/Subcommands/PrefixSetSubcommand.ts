import { BotCommand, Category, ICommandOptions } from '@Core/Commands';
import { RESTClient } from '@Core/REST';
import { PrefixArgument } from '@Options';

export class PrefixSetSubcommand extends BotCommand {
  name = 'set';

  title = 'Prefix set subcommand';

  description = 'Sets custom prefix on a server.';

  category = Category.Utility;

  constructor() {
    super();

    this.addOption(new PrefixArgument());
  }

  async execute({ cachedChannel, msg, interaction }: ICommandOptions): Promise<void> {
    const prefix = this.getValue(PrefixArgument) as string;

    if (!cachedChannel.server) {
      throw new Error('Custom prefixes are not supported in direct messages!');
    }

    if (prefix.length !== prefix.trim().length) {
      throw new Error('Whitespace characters are not allowed as a prefix!');
    }

    cachedChannel.server.prefix = prefix;

    await RESTClient.upsertChatChannel(cachedChannel);

    const answer = msg?.channel.send ?? interaction?.followUp;

    await answer?.(`New server prefix is \`${prefix}\``);
  }
}
