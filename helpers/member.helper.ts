import { GuildMember } from 'discord.js';
import { getDoc, readDirectory, saveDoc } from './files.helper';
import { addTime, getTime } from './time.helper';
import { MAX_STRIKES } from '../config.json';
import { getRole } from './roles.helper';

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
const kickUser = async (member: GuildMember, reason: string): Promise<string> => {
  try {
    const user = await getUser(member);

    // member.kick(reason); // TODO Reactivate.

    if (!user.strikes?.includes(reason)) user.strikes?.push(reason);

    saveDoc(`users/${member.user.username}`, user);

    return `${member.displayName} has been kicked.\n${reason}`;
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
const banUser = async (member: GuildMember, reason: string, time?: string): Promise<string> => {
  try {
    const user = await getUser(member);
    const days = getTime(time || '');
    const DMChannel = await member.createDM();

    // member.ban({ days, reason }); // TODO Reactivate.

    if (days) reason = `${reason} for ${days} days.`;
    if (!user.strikes?.includes(reason)) user.strikes?.push(reason);

    delete user.roles;

    saveDoc(`users/${member.user.id}`, user);

    DMChannel.send(`You have been banned from ${member.guild.name}.\n${reason}`);

    return `${member.displayName} has been banned.\n${reason}`;
  } catch (error) {
    throw error;
  }
};

const muteUser = async (member: GuildMember, reason: string, time?: string): Promise<string | void> => {
  try {
    const user = await getUser(member);
    const role = await getRole(member.guild.roles, 'Muted', member.guild.systemChannel);
    const minutes = getTime(time || '');

    if (!role) return;
    if (minutes) {
      reason = reason.replace(minutes.toString() || '', '');
      reason = `${reason} for ${minutes} minutes.`;
      user.timer = addTime('minutes', minutes);
    }

    if (!user.strikes?.includes(reason)) user.strikes?.push(reason);

    if (!member.roles.cache.has(role.id)) await member.roles.add(role);

    if (!user.roles?.includes(role.id)) user.roles?.push(role.id);

    saveDoc(`users/${member.user.id}`, user);

    return `${member.displayName} has been muted.\n${reason}`;
  } catch (error) {
    throw error;
  }
};

const unmuteUser = async (member: GuildMember) => {
  try {
    const user = await getUser(member);
    const role = await getRole(member.guild.roles, 'Muted', member.guild.systemChannel);

    if (!role) return;

    if (member.roles.cache.has(role.id)) await member.roles.remove(role);

    if (user.roles?.includes(role.id)) user.roles.splice(user.roles.indexOf(role.id), 1);

    saveDoc(`users/${member.user.id}`, user);

    return `${member.displayName} has been unmuted.`;
  } catch (error) {
    throw error;
  }
};

const warnUser = async (member: GuildMember, reason: string): Promise<string> => {
  try {
    const user = await getUser(member);

    if (!user.strikes?.includes(reason)) user.strikes?.push(reason);

    if (user.strikes?.length === MAX_STRIKES) return await banUser(member, `Warned ${MAX_STRIKES} times, out!`);

    if (user.strikes?.length && user.strikes?.length >= MAX_STRIKES / 2)
      return (await muteUser(member, `Warned ${MAX_STRIKES / 2} times, better watch it!`)) || '';

    saveDoc(`users/${member.user.username}`, user);

    return `${member.displayName} has been warned.\n${reason}`;
  } catch (error) {
    throw error;
  }
};

const forgiveUser = async (member: GuildMember, amount: string): Promise<string | void> => {
  try {
    const user = await getUser(member);
    const amountNumber = parseInt(amount);

    if (!user.strikes?.length) return `${member.user.username} has no strikes.`;

    if (!amountNumber || amountNumber < 1 || (amountNumber >= MAX_STRIKES && isNaN(amountNumber))) {
      user.strikes.shift();
      return `A warning has been removed from ${member.user.username}.`;
    }

    for (let i = 0; i < amountNumber; i++) {
      user.strikes.shift();
      return `${amountNumber} warnings have been removed from ${member.user.username}`;
    }
  } catch (error) {
    throw error;
  }
};

const listWarnings = async (): Promise<string> => {
  try {
    const userList = await readDirectory(`users`); // TODO Preface it with the guild id/name.
    const warningsList = [];

    for await (const username of userList) {
      const userDoc = await getDoc(`users/${username}`);
      if (userDoc.strikes?.length) warningsList.push(`${username} - ${userDoc.strikes.length}`);
    }

    if (!warningsList.length) return 'I have no record of any warned users.';

    return warningsList.join('/n');
  } catch (error) {
    throw error;
  }
};

const getUserByUsername = async (username: string) => {
  try {
    const userList = await readDirectory('users');

    for await (const user of userList) {
      const userDoc = await getDoc(`users/${user}`);

      if ((userDoc.username = username)) return userDoc;
    }
  } catch (error) {
    throw error;
  }
};

const getUserWarnings = async (member: GuildMember): Promise<string> => {
  try {
    const user = await getUser(member);

    if (!user.strikes?.length) return `${member.user.username} has no strikes.`;

    let reply = `${member.user.username}\n`;

    for await (const warning of user.strikes) {
      reply = `${reply}- ${warning}\n`;
    }

    return reply;
  } catch (error) {
    throw error;
  }
};

const checkMember = (moderator: GuildMember, member: GuildMember): string | void => {
  if (!member) return 'You need to mention a valid user.';
  if (moderator.user.id === member.user.id) return 'You cannot moderate yourself!';
  if (!member.manageable) return `You cannot moderate ${member.user.username}.`;
};

export {
  banUser,
  checkMember,
  forgiveUser,
  getUser,
  getUserByUsername,
  getUserWarnings,
  kickUser,
  listWarnings,
  muteUser,
  unmuteUser,
  warnUser
};
