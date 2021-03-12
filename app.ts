// Dependencies
import { Client } from 'discord.js';

// Helpers
import { buildInfoCategory } from './helpers/channels.helper';
import { getCommands } from './helpers/command.helper';
import { checkMemberChanges } from './helpers/member.helper';
import { promote } from './helpers/roles.helper';
import { buildDatabase } from './helpers/storage.helper';
import { logError, logInfo, startTimers } from './helpers/utils.helper';

// Configurations
import { GAME_PREFIX, PREFIX, TOKEN } from './config.json';
import { throwEvent } from './helpers/game.helper';

const bot = new Client();
const commands = getCommands();

bot.login(TOKEN);

bot.on('ready', () => {
  logInfo(`The bot went online.`);

  for (const guild of bot.guilds.cache.array()) {
    promote(guild, bot.user);
    buildDatabase(guild);
    buildInfoCategory(guild);
    startTimers(guild);
  }

  console.log('Ready.');
});

bot.on('message', async (message) => {
  try {
    if (message.channel.type === 'dm') {
      if (!message.content.startsWith(GAME_PREFIX)) return;

      const choice = message.content.slice(GAME_PREFIX.length).trim().split(/ +/g)[0];
      const reply = throwEvent(choice.toUpperCase());

      if (!reply) return;

      message.channel.send(reply);

      return;
    }

    // Check message content

    if (!message.content.startsWith(PREFIX)) return;

    const args = message.content.slice(PREFIX.length).trim().split(/ +/g);
    const command = commands.get(args.shift()?.toLowerCase() || '');

    if (!command) {
      message.channel.send('Invalid command.');
      return;
    }

    await command.execute(message, args);
  } catch (error) {
    message.channel.send('There was an error trying to execute that command!');
    logError(error);
  }
});

bot.on('messageUpdate', (oldMessage, newMessage) => {
  try {
    console.log('message updated, checking');
  } catch (error) {
    logError(error);
  }
});

bot.on('guildMemberAdd', (member) => {
  try {
    console.log('new member, registering');
  } catch (error) {
    logError(error);
  }
});

bot.on('guildMemberUpdate', (oldMember, newMember) => {
  try {
    checkMemberChanges(oldMember, newMember);
  } catch (error) {
    logError(error);
  }
});

bot.on('error', (error) => logError(error));
