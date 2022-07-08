import { Interaction } from 'discord.js';
import { IDiscordChannelResponse } from '@Core/REST';
import { InteractionHandler } from './InteractionHandler';

export class MessageComponentHandler extends InteractionHandler {
  async handleInteraction(interaction: Interaction, channel: IDiscordChannelResponse): Promise<any> {
    channel;

    return interaction;
  }
}
