import { CommandInteraction, Message } from 'discord.js';
import { CommandData } from 'cli-processor';
import { BotCommand } from './BotCommand';
import { Bot } from '../Bot';
import { IChatChannelResponse } from '../REST';

export interface ICommandOptions {
  bot: Bot;
  msg?: Message;
  interaction?: CommandInteraction;
  data: CommandData;
  commands: BotCommand[];
  cachedChannel: IChatChannelResponse;
}
