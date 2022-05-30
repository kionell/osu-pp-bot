import { IDiscordServerDto } from './IDiscordServerDto';

/**
 * Discord channel data.
 */
export interface IDiscordChannelDto {
  /**
   * Discord channel ID.
   */
  id: string | number;

  /**
   * Last saved beatmap ID.
   */
  beatmapId: number;

  /**
   * Nested discord server data.
   */
  server?: IDiscordServerDto | null;
}
