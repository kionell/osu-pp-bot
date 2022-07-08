import { Interaction } from 'discord.js';
import { IDiscordChannelResponse } from '@Core/REST';
import { Handler } from './Handler';

export abstract class InteractionHandler extends Handler {
  abstract handleInteraction(interaction: Interaction, channel: IDiscordChannelResponse): any;
}
