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
      const channel = await MessageEvent.getDatabaseDiscordChannel(msg);

      if (!channel) return;

      await MessageEvent.updateLastBeatmapId(msg, channel);

      if (!MessageEvent.validateMessage(msg)) return;

      if (await new ScoreAttachmentHandler().handleMessage(msg, channel)) return;
      if (await new BeatmapAttachmentHandler().handleMessage(msg, channel)) return;
      if (await new MessageCommandHandler().handleMessage(msg, channel)) return;
      if (await new BeatmapURLHandler().handleMessage(msg, channel)) return;
      if (await new ScoreURLHandler().handleMessage(msg, channel)) return;
    }
    catch (err: unknown) {
      const isTimedOut = msg.guild?.me?.isCommunicationDisabled() ?? false;
      const hasPermissions = msg.guild?.me?.permissions.has('SEND_MESSAGES') ?? true;

      if (err && !isTimedOut && hasPermissions) {
        msg.channel.send((err as Error).message ?? err);
      }
    }
  }
}
