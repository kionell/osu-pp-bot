import { MessageAttachment } from 'discord.js';
import { AttachmentType } from './Enums';

/**
 * Command attachments.
 */
export class CommandAttachments {
  /**
   * Current message attachments.
   */
  current: MessageAttachment[] = [];

  /**
   * Attachments of the referenced message.
   */
  referenced: MessageAttachment[] = [];

  /**
   * Total amount of the attachments.
   */
  get total(): number {
    return this.current.length + this.referenced.length;
  }

  /**
   * Searches for  attachment with specific type.
   * @param type Attachment type.
   * @returns Found attachment or null.
   */
  getCurrentAttachmentOfType(type: AttachmentType): MessageAttachment | null {
    return this._findAttachment(type, this.current);
  }

  /**
   * Searches for referenced attachment with specific type.
   * @param type Attachment type.
   * @returns Found attachment or null.
   */
  getReferencedAttachmentOfType(type: AttachmentType): MessageAttachment | null {
    return this._findAttachment(type, this.referenced);
  }

  /**
   * Searches for any attachment with specific type.
   * @param type Attachment type.
   * @returns Found attachment or null.
   */
  getAttachmentOfType(type: AttachmentType): MessageAttachment | null {
    return this.getCurrentAttachmentOfType(type)
      ?? this.getReferencedAttachmentOfType(type);
  }

  /**
   * Searches for an attachment with specific type in a list.
   * @param type Attachment type.
   * @param list List to search.
   * @returns Found attachment or null.
   */
  private _findAttachment(type: AttachmentType, list: MessageAttachment[]): MessageAttachment | null {
    const found = list.find((attachment: MessageAttachment) => {
      const name = attachment.name ?? attachment.url;

      return name.endsWith(`.${type}`);
    });

    return found ?? null;
  }
}
