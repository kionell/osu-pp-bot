import { Message } from 'discord.js';
import { MessageEvent } from '@Core/Events';

import {
  BeatmapURLHandler,
  ScoreURLHandler,
  MessageCommandHandler,
  BeatmapAttachmentHandler,
  ScoreAttachmentHandler,
} from '../Handlers';

export class MessageCreateEvent extends MessageEvent {
  name = 'messageCreate';

  async handle(msg: Message): Promise<void> {
    try {
      const cachedChannel = await MessageEvent.getDatabaseChatChannel(msg);

      if (!cachedChannel) return;

      await MessageEvent.updateLastBeatmapId(msg, cachedChannel);

      if (!MessageEvent.validateMessage(msg)) return;

      if (await new ScoreAttachmentHandler().handleMessage(msg, cachedChannel)) return;
      if (await new BeatmapAttachmentHandler().handleMessage(msg, cachedChannel)) return;
      if (await new MessageCommandHandler().handleMessage(msg, cachedChannel)) return;
      if (await new BeatmapURLHandler().handleMessage(msg, cachedChannel)) return;
      if (await new ScoreURLHandler().handleMessage(msg, cachedChannel)) return;
    }
    catch (err: unknown) {
      const isTimedOut = msg.guild?.me?.isCommunicationDisabled() ?? false;
      const hasPermissions = msg.guild?.me?.permissions.has('SEND_MESSAGES') ?? true;

      if (!err || isTimedOut || !hasPermissions) return;

      const message = (err as Error).message ?? err;

      msg.channel.send(message);
      console.warn(message);
    }
  }
}
