import { Argument, IHasArgument } from 'cli-processor';
import { BotCommand, ICommandOptions } from '@Core/Commands';
import { RESTClient } from '@Core/REST';

export class PrefixSetSubcommand extends BotCommand implements IHasArgument {
  name = 'set';

  title = 'Prefix set subcommand';

  description = 'Sets custom prefix on a server.';

  arg = new Argument<string>({
    description: 'prefix',
    isRequired: true,
    minLength: 1,
  });

  async execute({ channel, msg }: ICommandOptions): Promise<void> {
    const prefix = this.getValue(this.arg) as string;

    if (!channel.server) {
      throw new Error('Custom prefixes are not supported in direct messages!');
    }

    if (prefix.length !== prefix.trim().length) {
      throw new Error('Whitespace characters are not allowed as a prefix!');
    }

    if (prefix.length > 15) {
      throw new Error('A little too much for a prefix? Max limit is 15 characters!');
    }

    channel.server.prefix = prefix;

    await RESTClient.upsertDiscordChannel(channel);

    await msg.channel.send(`New server prefix is \`${prefix}\``);
  }
}
