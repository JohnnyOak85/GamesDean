import { Client } from 'discord.js';
import { logError, logInfo } from './helpers/logs.helper';
import { getCommands } from './helpers/command.helper';
import { PREFIX, TOKEN } from './config.json';

const bot = new Client();
const commands = getCommands();

bot.login(TOKEN);

bot.on('ready', () => {
  logInfo(`The bot went online.`);
});

bot.on('message', async (message) => {
  try {
    if (!message.content.startsWith(PREFIX)) return;

    const args = message.content.slice(PREFIX.length).trim().split(/ +/g);
    const commandName = args.shift()?.toLowerCase() || '';
    const command = commands.get(commandName);

    if (!command) {
      await message.channel.send('Invalid command.');
      return;
    }

    await command.execute(message, args);
  } catch (error) {
    await message.channel.send('There was an error trying to execute that command!');
    logError(error);
  }
});

bot.on('error', (error) => logError(error));
