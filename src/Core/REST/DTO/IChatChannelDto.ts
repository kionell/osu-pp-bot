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
  beatmapId: number;

  /**
   * Nested chat server data.
   */
  server?: IChatServerDto | null;
}
