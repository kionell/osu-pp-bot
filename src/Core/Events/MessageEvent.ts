import { APIFactory } from '@kionell/osu-api';
import { Message } from 'discord.js';
import { BotEvent } from './BotEvent';

import {
  RESTClient,
  IChatChannelResponse,
  IChatChannelDto,
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

  static async getDatabaseChatChannel(msg: Message): Promise<IChatChannelResponse | null> {
    /**
     * If REST API is currently unavailable then we should 
     * disable all bot messages until it became available again.
     */
    if (!RESTClient.isAvailable && msg.author.bot) return null;

    const found = await RESTClient.findChatChannel(msg.channelId);

    if (found) return found;

    const channelData: Partial<IChatChannelDto> = {
      id: msg.channelId,
    };

    if (msg.guildId) {
      channelData.server = { id: msg.guildId };
    }

    return await RESTClient.upsertChatChannel(channelData);
  }

  static async updateLastBeatmapId(msg: Message, cachedChannel: IChatChannelResponse): Promise<boolean> {
    const serverName = getServerNameFromMessage(msg);

    if (!serverName) return false;

    const scanner = APIFactory.createURLScanner(serverName);
    const beatmapId = getBeatmapIdFromMessage(scanner, msg, false);

    if (!beatmapId || cachedChannel.beatmapId === beatmapId) return false;

    cachedChannel.beatmapId = beatmapId;

    await RESTClient.upsertChatChannel(cachedChannel);

    return true;
  }
}
