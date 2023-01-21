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

export function getMD5FromMessage(msg: Message, reference = true): string {
  const MD5Regex = /[0-9a-f]{32}/i;

  const getMD5FromString = (input?: string | null): string | null => {
    return input?.split(' ').find((arg) => MD5Regex.test(arg)) ?? null;
  };

  const contentHash = getMD5FromString(msg.content);

  if (contentHash) return contentHash;

  const descriptionHash = getMD5FromString(msg.embeds[0]?.description);

  if (descriptionHash) return descriptionHash;

  const footerHash = getMD5FromString(msg.embeds[0]?.footer?.text);

  if (footerHash) return footerHash;

  if (reference && msg.reference?.messageId) {
    const messageId = msg.reference?.messageId;
    const ref = msg.channel.messages.cache.get(messageId);

    if (ref) return getMD5FromMessage(ref, false);
  }

  return '';
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

  const descriptionURL = scanner.getBeatmapURL(embeds[0]?.description);

  if (descriptionURL) {
    return scanner.getBeatmapIdFromURL(descriptionURL);
  }

  if (embeds[0]?.fields.length) {
    for (const field of embeds[0].fields) {
      const fieldURL = scanner.getBeatmapURL(field.name);

      if (fieldURL) {
        return scanner.getBeatmapIdFromURL(fieldURL);
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

  const descriptionURL = scanner.getScoreURL(embeds[0]?.description);

  if (descriptionURL) {
    return scanner.getScoreIdFromURL(descriptionURL);
  }

  if (embeds[0]?.fields.length) {
    for (const field of embeds[0].fields) {
      const fieldURL = scanner.getScoreURL(field.name);

      if (fieldURL) {
        return scanner.getScoreIdFromURL(fieldURL);
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
