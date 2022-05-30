import { APIFactory } from '@kionell/osu-api';
import { Message } from 'discord.js';
import { BotEvent } from './BotEvent';

import {
  RESTClient,
  IDiscordChannelResponse,
  IDiscordChannelDto,
} from '../REST';

import {
  getBeatmapIdFromMessage,
  getServerNameFromMessage,
} from '../Utils';

/**
 * A discord bot message event.
 */
export abstract class MessageEvent extends BotEvent {
  static validateMessage(msg: Message): boolean {
    // If the message is from a bot or empty.
    return !(msg.author.bot || (!msg.content && !msg.embeds && !msg.attachments));
  }

  static async getDatabaseDiscordChannel(msg: Message): Promise<IDiscordChannelResponse | null> {
    /**
     * If REST API is currently unavailable then we should 
     * disable all bot messages until it became available again.
     */
    if (!RESTClient.isAvailable && msg.author.bot) return null;
    
    const found = await RESTClient.findDiscordChannel(msg.channelId);

    if (found) return found;

    const channelData: Partial<IDiscordChannelDto> = {
      id: msg.channelId,
    };

    if (msg.guildId) {
      channelData.server = { id: msg.guildId };
    }

    return await RESTClient.upsertDiscordChannel(channelData);
  }

  static async updateLastBeatmapId(msg: Message, channel: IDiscordChannelResponse): Promise<boolean> {
    const serverName = getServerNameFromMessage(msg);

    if (!serverName) return false;

    const scanner = APIFactory.createURLScanner(serverName);
    const beatmapId = getBeatmapIdFromMessage(scanner, msg, false);

    if (!beatmapId || channel.beatmapId === beatmapId) return false;

    channel.beatmapId = beatmapId;

    await RESTClient.upsertDiscordChannel(channel);

    return true;
  }
}
