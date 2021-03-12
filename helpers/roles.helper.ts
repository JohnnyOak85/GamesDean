// Dependencies
import { ClientUser, Guild, GuildMember, Role, RoleManager, TextChannel } from 'discord.js';

// Helpers
import { updatePermissions } from './channels.helper';
import { getUser } from './member.helper';
import { saveDoc } from './storage.helper';
import { addTime, getNumber, logInfo } from './utils.helper';

// Models
import { RoleSchema } from '../models/role.model';

// Resources
import { BOT, MUTED } from '../resources/roles';

/**
 * @description Creates a new role in the guild.
 * @param roleManager
 * @param roleName
 */
const createRole = async (
  roleManager: RoleManager,
  roleSchema: RoleSchema,
  channel: TextChannel | null | undefined
): Promise<Role> => {
  try {
    const role = await roleManager.create({
      data: {
        name: roleSchema.name,
        permissions: roleSchema.activePermissions
      }
    });

    channel?.send(`Created new role ${roleSchema.name}.`);
    logInfo(`Created role ${roleSchema.name} on ${roleManager.guild.name}.`);

    return role;
  } catch (error) {
    throw error;
  }
};

/**
 * @description Retrieves a role entity.
 * @param roleManager
 * @param roleName
 */
const getRole = async (
  roleManager: RoleManager | undefined,
  roleSchema: RoleSchema,
  channel: TextChannel | null | undefined
): Promise<Role | void> => {
  try {
    if (!roleManager) return;
    const role = roleManager.cache.find((guildRole) => guildRole.name === roleSchema.name);

    if (!role) return await createRole(roleManager, roleSchema, channel);

    return role;
  } catch (error) {
    throw error;
  }
};

/**
 * @description Ensures the bot has the correct role.
 * @param guildList
 * @param bot
 */
const promote = async (guild: Guild, bot: ClientUser | null): Promise<void> => {
  try {
    const botUser = await guild.members.fetch(bot || '');
    const role = await getRole(guild.roles, BOT, guild.systemChannel);

    if (role && !guild.roles.cache.has(role.id)) {
      botUser.roles.add(role);
      logInfo(`Bot has full moderator privileges.`);
    }
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

    if (!user.strikes.includes(reason)) user.strikes.push(reason);
    if (!member.roles.cache.has(role.id)) await member.roles.add(role);
    if (!user.roles.includes(role.id)) user.roles.push(role.id);

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

    if (user.roles.includes(role.id)) user.roles.splice(user.roles.indexOf(role.id), 1);

    saveDoc(`${member.guild.id}/${member.user.id}`, user);

    return `${member.displayName} has been unmuted.`;
  } catch (error) {
    throw error;
  }
};

export { getRole, muteUser, promote, unmuteUser };
