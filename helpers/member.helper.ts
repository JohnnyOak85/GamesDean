import { DMChannel, GuildMember, NewsChannel, TextChannel } from 'discord.js';
import { getDoc, saveDoc } from './files.helper';
import { getTime } from './time.helper';

/**
 * @description Guarantees the user document has all needed proprieties.
 * @param user
 * @param member
 */
const ensureDoc = (user: User, member: GuildMember): User => {
  if (!user._id) user._id = member.id;
  if (!user.username) user.username = member.user.username;
  if (!user.strikes) user.strikes = [];
  if (!user.roles) user.roles = member.roles.cache.map((role) => role.id);
  if (!user.nickname) user.nickname = member.nickname;

  return user;
};

/**
 * @description Returns a user document from the database.
 * @param member
 */
const getUser = async (member: GuildMember): Promise<User> => {
  try {
    const userDoc = await getDoc(`users/${member.user.id}`);

    return ensureDoc(userDoc, member);
  } catch (error) {
    throw error;
  }
};

/**
 * @description Momentarily removes a user from the guild.
 * @param member
 * @param channel
 * @param reason
 */
const kickUser = async (member: GuildMember, channel: TextChannel | null | undefined, reason: string): Promise<void> => {
  try {
    const user = await getUser(member);

    // member.kick(reason); // TODO Reactivate.

    user.strikes?.push(reason);

    saveDoc(`users/${member.user.username}`, user);

    channel?.send(`${member.displayName} has been kicked.\n${reason}`);
  } catch (error) {
    throw error;
  }
};

/**
 * @description Removes a user from the guild.
 * @param member
 * @param channel
 * @param reason
 */
const banUser = async (
  member: GuildMember,
  channel: TextChannel | null | undefined,
  reason: string,
  time: string
): Promise<void> => {
  try {
    const user = await getUser(member);
    const days = getTime(time);
    const DMChannel = await member.createDM();

    // member.ban({ days, reason }); // TODO Reactivate.

    if (days) reason = `${reason} for ${days} days.`;

    user.strikes?.push(reason);
    delete user.roles;
    
    saveDoc(`users/${member.user.id}`, user);

    DMChannel.send(`You have been banned from ${member.guild.name}.\n${reason}`);
    channel?.send(`${member.displayName} has been banned.\n${reason}`);
  } catch (error) {
    throw error;
  }
};

/**
 * @description Guarantees the mentioned user is valid.
 * @param moderator
 * @param member
 * @param channel
 */
const hasMember = async (
  moderator: GuildMember,
  member: GuildMember,
  channel: TextChannel | DMChannel | NewsChannel
): Promise<boolean> => {
  try {
    console.log(member);
    if (!member) {
      await channel.send('You need to mention a valid user.');
      return false;
    }

    if (moderator.user.id === member.user.id) {
      await channel.send('You cannot moderate yourself!');
      return false;
    }

    if (!member.manageable) {
      await channel.send(`You cannot moderate ${member.user.username}.`);
      return false;
    }

    return true;
  } catch (error) {
    throw error;
  }
};

export { banUser, getUser, hasMember, kickUser };
