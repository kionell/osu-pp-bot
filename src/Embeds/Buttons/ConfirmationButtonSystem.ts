import { MessageButton } from 'discord.js';
import { ButtonSystem } from '@Core/Embeds';

/**
 * Button system for confirmation messages.
 */
export class ConfirmationButtonSystem extends ButtonSystem {
  /**
   * Buttons for confirmation messages.
   */
  get buttons(): MessageButton[] {
    return [
      new MessageButton()
        .setStyle('DANGER')
        .setLabel('NO')
        .setCustomId('disagreement'),

      new MessageButton()
        .setStyle('SUCCESS')
        .setLabel('YES')
        .setCustomId('agreement'),
    ];
  }
}
