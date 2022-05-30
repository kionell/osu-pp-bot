import { MessageAttachment } from 'discord.js';
import { AttachmentType, CommandAttachments } from '@Core/Commands';
import { BeatmapCommand } from '@Commands/Beatmap';
import { AttachmentHandler } from './AttachmentHandler';

export class BeatmapAttachmentHandler extends AttachmentHandler {
  protected _validateAttachment(attachment: MessageAttachment): boolean {
    const limit = AttachmentHandler.SIZE_LIMIT;

    const isBeatmapAttachment = attachment.name?.endsWith('.osu');
    const isReplayAttachment = attachment.name?.endsWith('.osr');

    if (!isBeatmapAttachment && !isReplayAttachment) return false;

    if (attachment.size >= limit) {
      const megabytes = limit / 1024 / 1024;

      throw new Error(`This file is too large! Current file limit is ${megabytes} mb`);
    }

    return true;
  }

  /**
   * Checks if current attachments has only beatmap attachment.
   * @param attachments Command attachments.
   * @returns If message contains default attachments.
   */
  protected _isDefaultAttachments(attachments: CommandAttachments): boolean {
    return attachments.total === 1
      && !!attachments.getCurrentAttachmentOfType(AttachmentType.Beatmap);
  }

  protected _getDefaultCommand(): BeatmapCommand {
    return new BeatmapCommand();
  }
}
