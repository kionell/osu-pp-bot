import { IChatServer } from './IChatServer';

/**
 * Chat channel response.
 */
export interface IChatChannelResponse {
  /**
   * Chat channel ID.
   */
  id: string;

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
  server: IChatServer | null;
}
