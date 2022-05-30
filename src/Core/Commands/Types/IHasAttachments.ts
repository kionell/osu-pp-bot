import { CommandAttachments } from '../CommandAttachments';

/**
 * A command that can have file attachments.
 */
export interface IHasAttachments {
  /**
   * Attachments of this command.
   */
  attachments: CommandAttachments;
}
