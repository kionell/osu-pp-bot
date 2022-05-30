import { BotEvent } from '@Core/Events';

export class ReadyEvent extends BotEvent {
  name = 'ready';

  once = true;

  async handle(): Promise<void> {
    console.log('Bot is running!');
  }
}
