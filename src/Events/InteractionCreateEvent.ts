import { CommandInteraction, Interaction } from 'discord.js';
import { InteractionEvent } from '@Core/Events';

import {
  ApplicationCommandHandler,
  MessageComponentHandler,
} from '../Handlers';

export class InteractionCreateEvent extends InteractionEvent {
  name = 'interactionCreate';

  async handle(interaction: Interaction): Promise<void> {
    try {
      const cachedChannel = await InteractionEvent.getDatabaseDiscordChannel(interaction);

      if (!cachedChannel) return;

      if (interaction.isButton()) {
        const handler = new MessageComponentHandler();

        return await handler.handleInteraction(interaction, cachedChannel);
      }

      if (interaction.isCommand()) {
        const handler = new ApplicationCommandHandler();

        await handler.handleInteraction(interaction, cachedChannel);
        await InteractionEvent.updateLastBeatmapId(interaction, cachedChannel);
      }
    }
    catch (err: unknown) {
      const isTimedOut = interaction.guild?.me?.isCommunicationDisabled() ?? false;
      const hasPermissions = interaction.guild?.me?.permissions.has('SEND_MESSAGES') ?? true;

      if (!err || isTimedOut || !hasPermissions) return;

      if (interaction.isCommand()) {
        const commandInteraction = interaction as CommandInteraction;

        commandInteraction.editReply((err as Error).message ?? err);
      }
    }
  }
}
