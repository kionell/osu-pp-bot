import { MessageInteraction } from 'discord.js';
import { InteractionHandler } from './InteractionHandler';

export class ApplicationCommandHandler extends InteractionHandler {
  async handleInteraction(interaction: MessageInteraction): Promise<any> {
    return interaction;
  }
}
