/**
 * Nested chat server object.
 */
export interface IChatServer {
  /**
   * Chat server ID.
   */
  id: string;

  /**
   * Custom prefix that will be used on this server.
   */
  prefix: string | null;
}
