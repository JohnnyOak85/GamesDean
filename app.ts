import { Client, Collection } from 'discord.js';
import { logError, logInfo } from './helpers/logger.helper';
import { getDate } from './helpers/time.helper';
import { TOKEN } from './config.json';

const bot = new Client();
const commands = new Collection();

bot.login(TOKEN);

bot.on('ready', () => {
  logInfo(`The bot went online at: ${getDate()}`);
});

bot.on('message', () => {});

bot.on('error', (error) => logError(error));
