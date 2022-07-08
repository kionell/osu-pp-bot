import { BotEvent } from '@Core/Events';
import { Bot } from '@Core/Bot';

export class ReadyEvent extends BotEvent {
  name = 'ready';

  once = true;

  async handle(bot: Bot): Promise<void> {
    await bot.registerSlashCommands();

    console.log('Bot is running!');
  }
}
