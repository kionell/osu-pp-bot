import { BotCommand } from '@Core/Commands';
import { PrefixSetSubcommand } from './PrefixSetSubcommand';
import { PrefixResetSubcommand } from './PrefixResetSubcommand';

export class PrefixCommand extends BotCommand {
  name = 'prefix';

  title = 'Prefix command';

  description = [
    'Allows you to manage custom prefix on a server.',
    'Supports only one prefix per server.',
    'If you forgot what is your custom prefix on the server, you can use slash commands to reset it.',
  ].join(' ');

  constructor() {
    super();

    this.registerSubcommand(new PrefixSetSubcommand());
    this.registerSubcommand(new PrefixResetSubcommand());
  }
}
