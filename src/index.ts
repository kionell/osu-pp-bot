/**
 * Discord bot authorization links:
 * Debug: https://discord.com/api/oauth2/authorize?client_id=979423054855807137&permissions=414531832896&scope=bot%20applications.commands
 * Public: https://discord.com/api/oauth2/authorize?client_id=928302105893171230&permissions=414531832896&scope=bot%20applications.commands
 */
import { ClientOptions, Intents } from 'discord.js';
import { DebugBot, ReleaseBot } from './Clients';
import 'dotenv/config';

/* Create a new discord bot */
const options: ClientOptions = {
  intents: new Intents(
    Intents.FLAGS.GUILDS |
    Intents.FLAGS.GUILD_MESSAGES |
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS |
    Intents.FLAGS.DIRECT_MESSAGES |
    Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
  ),
  partials: [
    'MESSAGE', 'CHANNEL',
  ],
};

const bot = process.env.NODE_ENV === 'production'
  ? new ReleaseBot(options)
  : new DebugBot(options);

bot.init().catch((err: unknown) => console.error(err));

process.on('uncaughtException', (error) => {
  console.warn(error.message);
});
