import { Message, MessageAttachment } from 'discord.js';

import {
  CommandData,
  CommandParser,
  ICommand,
} from 'cli-processor';

import { MessageCommandHandler } from './MessageCommandHandler';
import { CommandAttachments, IHasAttachments } from '@Core/Commands';

export abstract class AttachmentHandler extends MessageCommandHandler {
  /**
   * This size limit exists to prevent overhead from large file downloading.
   * We will pretend that all our files are not larger than 8 mb.
   */
  static readonly SIZE_LIMIT = 1024 * 1024 * 8;

  protected async _getCommandData(commands: Map<string, ICommand>, msg: Message, prefix?: string): Promise<CommandData> {
    const attachments = this._getCommandAttachments(msg);

    if (!attachments.total) return new CommandData();

    const parser = new CommandParser({
      commandPrefix: prefix,
      commandList: commands,
      allowTooManyArgs: true,
      throwError: false,
    });

    const data = parser.parse(this._simulateCommandLine(msg));

    if (!data.isValid && this._isDefaultAttachments(attachments)) {
      data.tree.add(this._getDefaultCommand());
    }

    const command = data.tree.last as ICommand & IHasAttachments;

    if (command?.attachments) {
      command.attachments = attachments;
    }

    return data;
  }

  protected _getCommandAttachments(msg: Message): CommandAttachments {
    const attachments = new CommandAttachments();

    const current = msg.attachments.filter(this._validateAttachment);

    attachments.current = [...current.values()];

    if (msg.reference?.messageId) {
      const messageId = msg.reference?.messageId;
      const ref = msg.channel.messages.cache.get(messageId);

      if (!ref) return attachments;

      const referenced = ref.attachments.filter(this._validateAttachment);

      attachments.referenced = [...referenced.values()];
    }

    return attachments;
  }

  protected abstract _validateAttachment(attachment: MessageAttachment): boolean;
  protected abstract _isDefaultAttachments(attachments: CommandAttachments): boolean;
  protected abstract _getDefaultCommand(): ICommand;
}
