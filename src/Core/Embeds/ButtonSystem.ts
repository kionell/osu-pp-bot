import {
  InteractionCollector,
  MessageButton,
  Message,
  MessageActionRow,
  ButtonInteraction,
} from 'discord.js';

import { EventEmitter } from 'events';

type ButtonCollector = InteractionCollector<ButtonInteraction>;

/**
 * Abstract button system.
 */
export abstract class ButtonSystem extends EventEmitter {
  /**
   * Current message.
   */
  message?: Message;

  /**
   * Current button component collector.
   */
  collector?: ButtonCollector;

  /**
   * Should message be deleted when this button system will finish its work?
   */
  autoDelete = false;

  /**
   * Buttons of this buttons system.
   */
  abstract get buttons(): MessageButton[];

  /**
   * Actions rows of this button system.
   */
  get actionRows(): MessageActionRow[] {
    return [
      new MessageActionRow().addComponents(this.buttons),
    ];
  }

  execute(message: Message, collector: ButtonCollector, autoDelete = false): void {
    this.message = message;
    this.collector = collector;
    this.autoDelete = autoDelete;

    this.collector.on('collect', this.process.bind(this));
    this.collector.once('end', this.stop.bind(this));
  }

  /**
   * Processes current button interaction.
   * @param interaction Current button interaction.
   */
  async process(interaction: ButtonInteraction): Promise<void> {
    this.collector?.emit('end');

    this.emit(interaction.customId, this.message);
  }

  /**
   * Stops this button system and removes message or its components.
   */
  async stop(): Promise<void> {
    this.autoDelete
      ? await this.message?.delete()
      : await this.message?.edit({ components: [] });
  }
}
