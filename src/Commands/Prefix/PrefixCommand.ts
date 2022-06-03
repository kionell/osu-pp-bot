import { Permissions } from 'discord.js';
import { BotCommand, Category } from '@Core/Commands';
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

  /**
   * This command requires admin permissions.
   */
  permissions = new Permissions(Permissions.FLAGS.ADMINISTRATOR);

  /**
   * This is utility command.
   */
  category = Category.Utility;

  constructor() {
    super();

    this.registerSubcommand(new PrefixSetSubcommand());
    this.registerSubcommand(new PrefixResetSubcommand());
  }
}
