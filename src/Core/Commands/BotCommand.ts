import { Permissions } from 'discord.js';
import { Command } from 'cli-processor';
import { Category } from './Enums';
import { ICommandOptions } from './ICommandOptions';
import { EmbedShipment } from '../Embeds';

/**
 * A bot command.
 */
export abstract class BotCommand extends Command {

  /**
   * Required permissions to use this command
   */
  permissions: Readonly<Permissions | null> = null;

  /**
   * Command category.
   */
  abstract category: Category;

  protected _getEmbedShipment(options: ICommandOptions): EmbedShipment {
    const shipment = new EmbedShipment();

    if (options.msg) shipment.message(options.msg);
    if (options.interaction) shipment.interaction(options.interaction);

    return shipment;
  }
}
