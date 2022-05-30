import { MessageButton } from 'discord.js';
import { ButtonSystem } from '@Core/Embeds';

/**
 * Button system for alert messages.
 */
export class AlertButtonSystem extends ButtonSystem {
  /**
   * Buttons for alert messages.
   */
  get buttons(): MessageButton[] {
    return [
      new MessageButton()
        .setStyle('PRIMARY')
        .setLabel('OK')
        .setCustomId('ok'),
    ];
  }
}
