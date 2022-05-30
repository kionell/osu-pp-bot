import { MessageInteraction } from 'discord.js';
import { Handler } from './Handler';

export abstract class InteractionHandler extends Handler {
  abstract handleInteraction(interaction: MessageInteraction): any;
}
