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
  getMD5FromMessage,
} from '../Utils';

/**
 * A discord bot message event.
 */
export abstract class MessageEvent extends BotEvent {
  static validateMessage(msg: Message): boolean {
    const isBotMessage = msg.author.bot;
    const isEmptyMessage = !msg.content && !msg.embeds && !msg.attachments;

    // TODO: This is temporary measure until a better prefix management system is implemented.    
    const hasPrefix = msg.content.startsWith(process.env.DEFAULT_PREFIX);

    return !isBotMessage && !isEmptyMessage && hasPrefix;
  }

  static async getDatabaseChatChannel(msg: Message): Promise<IChatChannelResponse | null> {
    /**
     * If REST API is currently unavailable then we should 
     * return immediately to not throw error afterwards.
     * This is done to prevent bot spam on each message.
     */
    if (!RESTClient.isAvailable) return null;

    const found = await RESTClient.findChatChannel(msg.channelId);

    if (found) return found;

    const channelData: Partial<IChatChannelDto> = {
      id: msg.channelId,
    };

    if (msg.guildId) {
      channelData.server = { id: msg.guildId };
    }

    /**
     * We can skip upsert request if REST API is not available 
     * after {@link RESTClient.findChatChannel} request.
     */
    if (!RESTClient.isAvailable) return null;

    return await RESTClient.upsertChatChannel(channelData);
  }

  static async updateLastBeatmapId(msg: Message, cachedChannel: IChatChannelResponse): Promise<boolean> {
    const serverName = getServerNameFromMessage(msg);

    if (!serverName) return false;

    const scanner = APIFactory.createURLScanner(serverName);
    const beatmapId = getBeatmapIdFromMessage(scanner, msg, false);
    const beatmapMD5 = getMD5FromMessage(msg, false);

    // osu-pp-bot uses beatmap MD5 as unique key to work with unsubmitted beatmaps.
    if (beatmapMD5) {
      cachedChannel.beatmapId = null;
      cachedChannel.beatmapMD5 = beatmapMD5;
    }
    // Other bots have only beatmap ID.
    else if (beatmapId) {
      cachedChannel.beatmapId = beatmapId;
      cachedChannel.beatmapMD5 = null;
    }

    const differentId = cachedChannel.beatmapId !== beatmapId;
    const differentMD5 = cachedChannel.beatmapMD5 !== beatmapMD5;

    if (differentId || differentMD5) {
      await RESTClient.upsertChatChannel(cachedChannel);
    }

    return true;
  }
}
