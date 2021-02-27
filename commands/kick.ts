import { Message } from 'discord.js';
import { hasMember, kickUser } from '../helpers/member.helper';

module.exports = {
  name: 'kick',
  description: 'Mention a user and that user gets removed from the guild.',
  usage: '<user> <reason>',
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

          kickUser(member, message.guild?.systemChannel, reply);
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
