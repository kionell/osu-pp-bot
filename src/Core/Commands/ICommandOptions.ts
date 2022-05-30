import { Message } from 'discord.js';
import { CommandData } from 'cli-processor';
import { BotCommand } from './BotCommand';
import { Bot } from '../Bot';
import { IDiscordChannelResponse } from '../REST';

export interface ICommandOptions {
  bot: Bot;
  msg: Message;
  data: CommandData;
  commands: BotCommand[];
  channel: IDiscordChannelResponse;
}
