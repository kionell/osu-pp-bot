import { URLScanner, getServerName } from '@kionell/osu-api';
import { Message } from 'discord.js';

/**
 * Searches for server name in message content and embeds.
 * @param msg Current message.
 * @param reference Should message reference be scanned?
 * @returns Found server name.
 */
export function getServerNameFromMessage(msg: Message, reference = true): ReturnType<typeof getServerName> {
  const { content, embeds } = msg;

  const found = getServerName(content)
    ?? getServerName(embeds?.[0]?.url)
    ?? getServerName(embeds?.[0]?.author?.url)
    ?? getServerName(embeds?.[0]?.description);

  if (found) return found;

  if (embeds?.[0]?.fields.length) {
    for (const field of embeds[0].fields) {
      const found = getServerName(field.name);

      if (found) return found;
    }
  }

  if (found) return found;

  if (reference && msg.reference?.messageId) {
    const messageId = msg.reference?.messageId;
    const ref = msg.channel.messages.cache.get(messageId);

    if (ref) {
      return getServerNameFromMessage(ref, false);
    }
  }

  return null;
}

/**
 * Searches for beatmap ID in message content and embeds.
 * @param scanner URL scanner.
 * @param msg Current message.
 * @param reference Should message reference be scanned?
 * @returns Found beatmap ID.
 */
export function getBeatmapIdFromMessage(scanner: URLScanner, msg: Message, reference = true): number {
  const { content, embeds } = msg;

  const beatmapURL = content?.split(' ').find((arg) => {
    return scanner.isBeatmapURL(arg);
  });

  if (beatmapURL) {
    return scanner.getBeatmapIdFromURL(beatmapURL);
  }

  if (scanner.isBeatmapURL(embeds[0]?.url)) {
    return scanner.getBeatmapIdFromURL(embeds[0].url as string);
  }

  if (scanner.isBeatmapURL(embeds[0]?.author?.url)) {
    return scanner.getBeatmapIdFromURL(embeds[0].author?.url as string);
  }

  if (scanner.hasBeatmapURL(embeds[0]?.description)) {
    return scanner.getBeatmapIdFromURL(embeds[0].description as string);
  }

  if (embeds[0]?.fields.length) {
    for (const field of embeds[0].fields) {
      if (scanner.hasBeatmapURL(field.name)) {
        return scanner.getBeatmapIdFromURL(field.name);
      }
    }
  }

  if (reference && msg.reference?.messageId) {
    const messageId = msg.reference?.messageId;
    const ref = msg.channel.messages.cache.get(messageId);

    if (ref) {
      return getBeatmapIdFromMessage(scanner, ref, false);
    }
  }

  return 0;
}

/**
 * Searches for score ID in message content and embeds.
 * @param scanner URL scanner.
 * @param msg Current message.
 * @param reference Should message reference be scanned?
 * @returns Found score ID.
 */
export function getScoreIdFromMessage(scanner: URLScanner, msg: Message, reference = true): number {
  const { content, embeds } = msg;

  const scoreURL = content?.split(' ').find((arg) => {
    return scanner.isScoreURL(arg);
  });

  if (scoreURL) {
    return scanner.getScoreIdFromURL(scoreURL);
  }

  if (scanner.isScoreURL(embeds[0]?.url)) {
    return scanner.getScoreIdFromURL(embeds[0].url as string);
  }

  if (scanner.isScoreURL(embeds[0]?.author?.url)) {
    return scanner.getScoreIdFromURL(embeds[0].author?.url as string);
  }

  if (scanner.hasScoreURL(embeds[0]?.description)) {
    return scanner.getScoreIdFromURL(embeds[0].description as string);
  }

  if (embeds[0]?.fields.length) {
    for (const field of embeds[0].fields) {
      if (scanner.hasScoreURL(field.name)) {
        return scanner.getScoreIdFromURL(field.name);
      }
    }
  }

  if (reference && msg.reference?.messageId) {
    const messageId = msg.reference?.messageId;
    const ref = msg.channel.messages.cache.get(messageId);

    if (ref) {
      return getScoreIdFromMessage(scanner, ref, false);
    }
  }

  return 0;
}
