import { Message } from 'discord.js';
import { banUser, hasMember } from '../helpers/member.helper';

module.exports = {
  name: 'ban',
  description:
    'Mention a user and that user will be banned from the guild. Can be temporary if provided with a number between 1 and 100.',
  usage: '<user> <number of days> <reason>',
  moderation: true,
  execute: async (message: Message, args: string[]): Promise<void> => {
    try {
      if (!message.member?.hasPermission('BAN_MEMBERS')) {
        await message.channel.send('You do not have permission for this command.');

        return;
      }

      let reply = args.slice(1).join(' ');

      if (!reply) reply = 'No reason provided.';

      for await (const member of message.mentions.members?.array() || []) {
        try {
          if (!(await hasMember(message.member, member, message.channel))) return;

          banUser(member, message.guild?.systemChannel, reply, args[0]);
        } catch (error) {
          throw error;
        }
      }

      return;
    } catch (error) {
      throw error;
    }
  }
};
