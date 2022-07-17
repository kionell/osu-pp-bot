import { Interaction } from 'discord.js';
import { IChatChannelResponse } from '@Core/REST';
import { InteractionHandler } from './InteractionHandler';

export class MessageComponentHandler extends InteractionHandler {
  async handleInteraction(interaction: Interaction, channel: IChatChannelResponse): Promise<any> {
    channel;

    return interaction;
  }
}
