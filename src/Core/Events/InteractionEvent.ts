import { CommandInteraction, Interaction, Message } from 'discord.js';
import { BotEvent } from './BotEvent';
import { MessageEvent } from './MessageEvent';

import {
  RESTClient,
  IDiscordChannelResponse,
  IDiscordChannelDto,
} from '../REST';

/**
 * A discord bot interaction event.
 */
export abstract class InteractionEvent extends BotEvent {
  static validateMessage(interaction: Interaction): boolean {
    // If this interaction is from a bot.
    return !interaction.user.bot;
  }

  static async getDatabaseDiscordChannel(interaction: Interaction): Promise<IDiscordChannelResponse | null> {
    /**
     * If REST API is currently unavailable then we should 
     * disable all bot messages until it became available again.
     */
    if (!RESTClient.isAvailable && interaction.user.bot) return null;

    if (!interaction.channelId) return null;

    const found = await RESTClient.findDiscordChannel(interaction.channelId);

    if (found) return found;

    const channelData: Partial<IDiscordChannelDto> = {
      id: interaction.channelId,
    };

    if (interaction.guildId) {
      channelData.server = { id: interaction.guildId };
    }

    return await RESTClient.upsertDiscordChannel(channelData);
  }

  static async updateLastBeatmapId(interaction: CommandInteraction, cachedChannel: IDiscordChannelResponse): Promise<boolean> {
    const msg = await interaction.fetchReply() as Message;

    return MessageEvent.updateLastBeatmapId(msg, cachedChannel);
  }
}
