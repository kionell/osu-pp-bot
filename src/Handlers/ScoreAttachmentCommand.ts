import { MessageAttachment } from 'discord.js';
import { AttachmentType, CommandAttachments } from '@Core/Commands';
import { ScoreCommand } from '@Commands/Score';
import { AttachmentHandler } from './AttachmentHandler';

export class ScoreAttachmentHandler extends AttachmentHandler {
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
   * Checks if current attachments has 
   * only replay attachment or beatmap + replay attachment.
   * @param attachments Command attachments.
   * @returns If message contains default attachments.
   */
  protected _isDefaultAttachments(attachments: CommandAttachments): boolean {
    const isSingle = attachments.total === 1;
    const isBoth = attachments.total === 2;

    const hasReferencedBeatmapAttachment = !!attachments
      .getReferencedAttachmentOfType(AttachmentType.Beatmap);

    const hasCurrentBeatmapAttachment = !!attachments
      .getCurrentAttachmentOfType(AttachmentType.Beatmap);

    const hasBeatmapAttachment = hasReferencedBeatmapAttachment
      || hasCurrentBeatmapAttachment;

    const hasReplayAttachment = !!attachments
      .getCurrentAttachmentOfType(AttachmentType.Score);

    if (isSingle && hasReplayAttachment) return true;
    if (isBoth && hasBeatmapAttachment && hasReplayAttachment) return true;

    return false;
  }

  protected _getDefaultCommand(): ScoreCommand {
    return new ScoreCommand();
  }
}
