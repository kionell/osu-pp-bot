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
  beatmapId: number;

  /**
   * Nested chat server data.
   */
  server: IChatServer | null;
}
