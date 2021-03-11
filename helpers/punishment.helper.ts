// Dependencies
import { GuildMember } from 'discord.js';

// Helpers
import { updatePermissions } from './channels.helper';
import { getUser } from './member.helper';
import { getRole } from './roles.helper';
import { getDoc, readDirectory, saveDoc } from './storage.helper';
import { addTime, getNumber } from './utils.helper';

// Configurations
import { MAX_STRIKES } from '../config.json';

// Resources
import { MUTED } from '../resources/roles';

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

    saveDoc(`${member.guild.id}/${member.user.username}`, user);

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
    const days = getNumber(time || '');
    const DMChannel = await member.createDM();

    // member.ban({ days, reason }); // TODO Reactivate.

    if (days) reason = `${reason} for ${days} days.`;
    if (!user.strikes?.includes(reason)) user.strikes?.push(reason);

    delete user.roles;

    saveDoc(`${member.guild.id}/${member.user.id}`, user);

    DMChannel.send(`You have been banned from ${member.guild.name}.\n${reason}`);

    return `${member.displayName} has been banned.\n${reason}`;
  } catch (error) {
    throw error;
  }
};

/**
 * @description Gives a user the muted role, which makes it impossible to send messages to the guild.
 * @param member
 * @param reason
 * @param time
 */
const muteUser = async (member: GuildMember, reason: string, time?: string): Promise<string | undefined> => {
  try {
    const user = await getUser(member);
    const role = await getRole(member.guild.roles, MUTED, member.guild.systemChannel);
    const minutes = getNumber(time || '');

    if (!role) return;

    updatePermissions(member.guild.channels, role, MUTED.inactivePermissions);

    if (minutes) {
      reason = reason.replace(minutes.toString() || '', '');
      reason = `${reason} for ${minutes} minutes.`;
      user.timer = addTime('minutes', minutes);
    }

    if (!user.strikes?.includes(reason)) user.strikes?.push(reason);
    if (!member.roles.cache.has(role.id)) await member.roles.add(role);
    if (!user.roles?.includes(role.id)) user.roles?.push(role.id);

    saveDoc(`${member.guild.id}/${member.user.id}`, user);

    return `${member.displayName} has been muted.\n${reason}`;
  } catch (error) {
    throw error;
  }
};

/**
 * @description Removes the mute role from the user, allowing them to once again send messages to the guild.
 * @param member
 */
const unmuteUser = async (member: GuildMember): Promise<string | undefined> => {
  try {
    const user = await getUser(member);
    const role = await getRole(member.guild.roles, MUTED, member.guild.systemChannel);

    if (!role) return;

    if (member.roles.cache.has(role.id)) await member.roles.remove(role);

    if (user.roles?.includes(role.id)) user.roles.splice(user.roles.indexOf(role.id), 1);

    saveDoc(`${member.guild.id}/${member.user.id}`, user);

    return `${member.displayName} has been unmuted.`;
  } catch (error) {
    throw error;
  }
};

/**
 * @description Adds a warning to the user's warning list.
 * @param member
 * @param reason
 */
const warnUser = async (member: GuildMember, reason: string): Promise<string> => {
  try {
    const user = await getUser(member);

    if (!user.strikes?.includes(reason)) user.strikes?.push(reason);

    if (user.strikes?.length === MAX_STRIKES) return await banUser(member, `Warned ${MAX_STRIKES} times, out!`);

    if (user.strikes?.length && user.strikes?.length >= MAX_STRIKES / 2)
      return (await muteUser(member, `Warned ${MAX_STRIKES / 2} times, better watch it!`)) || '';

    saveDoc(`${member.guild.id}/${member.user.username}`, user);

    return `${member.displayName} has been warned.\n${reason}`;
  } catch (error) {
    throw error;
  }
};

/**
 * @description Removes one or more warnings from the user's warning list.
 * @param member
 * @param amount
 */
const forgiveUser = async (member: GuildMember, amount: string): Promise<string | undefined> => {
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

/**
 * @description Returns the list of users with warnings.
 * @param guildId
 */
const listWarnings = async (guildId: string): Promise<string> => {
  try {
    const userList = await readDirectory(guildId); // TODO Preface it with the guild id/name.
    const warningsList = [];

    for await (const username of userList) {
      const userDoc = await getDoc(`${guildId}/${username}`);
      if (userDoc.strikes?.length) warningsList.push(`${username} - ${userDoc.strikes.length}`);
    }

    if (!warningsList.length) return 'I have no record of any warned users.';

    return warningsList.join('/n');
  } catch (error) {
    throw error;
  }
};

/**
 * @description Returns the list of a user's warnings.
 * @param member
 */
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

export { banUser, forgiveUser, getUser, getUserWarnings, kickUser, listWarnings, muteUser, unmuteUser, warnUser };
