/**
 * Chat server data.
 */
export interface IChatServerDto {
  /**
   * Chat server ID.
   */
  id: string | number;

  /**
   * Custom prefix that will be used on this server.
   */
  prefix?: string | null;
}
