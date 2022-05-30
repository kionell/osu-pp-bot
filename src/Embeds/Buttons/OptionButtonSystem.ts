import { MessageButton } from 'discord.js';
import { ButtonSystem } from '@Core/Embeds';

/**
 * Button system for messages with options.
 */
export class OptionButtonSystem extends ButtonSystem {
  readonly MIN_OPTIONS_COUNT = 2;
  readonly MAX_OPTIONS_COUNT = 4;

  /**
   * How many options will this button system have?
   */
  private _options: number = this.MIN_OPTIONS_COUNT;

  /**
   * Buttons for messages with options.
   */
  get buttons(): MessageButton[] {
    const components = [];

    for (let i = 1; i <= this._options; ++i) {
      components.push(
        new MessageButton()
          .setStyle('SECONDARY')
          .setLabel(i.toString())
          .setCustomId(i.toString()),
      );
    }

    return components;
  }

  constructor(options?: number) {
    super();

    const min = this.MIN_OPTIONS_COUNT;
    const max = this.MAX_OPTIONS_COUNT;

    const count = options || min;

    this._options = Math.max(min, Math.min(count, max)) || min;
  }
}
