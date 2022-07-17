import { Interaction } from 'discord.js';
import { IChatChannelResponse } from '@Core/REST';
import { Handler } from './Handler';

export abstract class InteractionHandler extends Handler {
  abstract handleInteraction(interaction: Interaction, channel: IChatChannelResponse): any;
}
