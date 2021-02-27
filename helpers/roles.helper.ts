import { GuildMemberRoleManager, Role, RoleManager, TextChannel } from 'discord.js';
import { logInfo } from './logs.helper';

/**
 * @description Creates a new role in the guild.
 * @param roleManager
 * @param roleName
 */
const createRole = async (roleManager: RoleManager, roleName: string, channel: TextChannel | null | undefined): Promise<Role> => {
  try {
    const permissions = {};
    const role = await roleManager.create({
      data: {
        name: roleName
        // permissions: permissions,
      }
    });

    channel?.send(`Created new role ${roleName}.`);
    logInfo(`Created role ${roleName} on ${roleManager.guild.name}.`);

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
const getRole = async (roleManager: RoleManager, roleName: string, channel: TextChannel | null | undefined): Promise<Role> => {
  try {
    const role = roleManager.cache.find((guildRole) => guildRole.name === roleName);

    if (!role) return await createRole(roleManager, roleName, channel);

    return role;
  } catch (error) {
    throw error;
  }
};

/**
 * @description Gives a specific role to a user.
 * @param roleManager
 * @param roleName
 * @param userRoleManager
 */
const giveRole = async (
  roleManager: RoleManager,
  roleName: string,
  userRoleManager: GuildMemberRoleManager,
  channel: TextChannel | null | undefined
): Promise<any> => {
  try {
    const role = await getRole(roleManager, roleName, channel);

    if (userRoleManager.cache.has(role.id)) return;

    await userRoleManager.add(role);

    channel?.send(`${userRoleManager.member.nickname} is now ${roleName}.`);
    logInfo(`Gave role ${roleName} to ${userRoleManager.member.nickname}.`);
  } catch (error) {
    throw error;
  }
};

/**
 * @description Removes a specific role from a user.
 * @param roleManager
 * @param roleName
 * @param userRoleManager
 */
const removeRole = async (
  roleManager: RoleManager,
  roleName: string,
  userRoleManager: GuildMemberRoleManager,
  channel: TextChannel | null | undefined
): Promise<void> => {
  try {
    const role = await getRole(roleManager, roleName, channel);

    if (!userRoleManager.cache.has(role.id)) return;

    await userRoleManager.remove(role);

    channel?.send(`${userRoleManager.member.nickname} is no longer ${roleName}.`);
    logInfo(`Removed role ${roleName} from ${userRoleManager.member.nickname}.`);
  } catch (error) {
    throw error;
  }
};

export { createRole, getRole, giveRole, removeRole };
