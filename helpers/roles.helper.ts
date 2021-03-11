// Discord
import { ClientUser, Guild, PermissionResolvable, Role, RoleManager, TextChannel } from 'discord.js';

// Helpers
import { logInfo } from './utils.helper';

/**
 * @description Creates a new role in the guild.
 * @param roleManager
 * @param roleName
 */
const createRole = async (
  roleManager: RoleManager,
  roleName: string,
  permissions: PermissionResolvable,
  channel: TextChannel | null | undefined
): Promise<Role> => {
  try {
    const role = await roleManager.create({
      data: {
        name: roleName,
        permissions: permissions
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
const getRole = async (
  roleManager: RoleManager | undefined,
  roleName: string,
  permissions: PermissionResolvable,
  channel: TextChannel | null | undefined
): Promise<Role | void> => {
  try {
    if (!roleManager) return;
    const role = roleManager.cache.find((guildRole) => guildRole.name === roleName);

    if (!role) return await createRole(roleManager, roleName, permissions, channel);

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
    const role = await getRole(guild.roles, 'bot', ['ADMINISTRATOR'], guild.systemChannel);

    if (role && !guild.roles.cache.has(role.id)) {
      botUser.roles.add(role);
      logInfo(`Bot has full moderator privileges.`);
    }
  } catch (error) {
    throw error;
  }
};

export { getRole, promote };
