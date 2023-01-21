import { IChatServerDto } from './IChatServerDto';

/**
 * Chat channel data.
 */
export interface IChatChannelDto {
  /**
   * Chat channel ID.
   */
  id: string | number;

  /**
   * Last saved beatmap ID.
   */
  beatmapId: number | null;

  /**
   * Last saved beatmap MD5 hash.
   */
  beatmapMD5: string | null;

  /**
   * Nested chat server data.
   */
  server?: IChatServerDto | null;
}
