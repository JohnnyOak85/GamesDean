import { Collection } from 'discord.js';
import { readdirSync } from 'fs-extra';

const commands = new Collection<string, Command>();

const getCommands = () => {
  try {
    if (!commands.array().length) setCommands();

    return commands;
  } catch (error) {
    throw error;
  }
};

const setCommands = () => {
  try {
    const commandList = readdirSync(`${__dirname}/../commands`);

    for (const command of commandList) {
      const commandFile = require(`../commands/${command}`);
      commands.set(commandFile.name, commandFile);
    }
  } catch (error) {
    throw error;
  }
};

export { getCommands };
