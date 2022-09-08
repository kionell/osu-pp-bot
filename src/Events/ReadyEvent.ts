import { BotEvent } from '@Core/Events';
import { Bot } from '@Core/Bot';

export class ReadyEvent extends BotEvent {
  name = 'ready';

  once = true;

  async handle(bot: Bot): Promise<void> {
    console.log('Bot is running!');
    console.log('Registering slash commands...');

    await bot.registerSlashCommands();

    console.log('Successfuly registered slash commands!');
  }
}
