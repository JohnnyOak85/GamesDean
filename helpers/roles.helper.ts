// Dependencies
import { ClientUser, Guild, Role, RoleManager, TextChannel } from 'discord.js';

// Helpers
import { logInfo } from './utils.helper';

// Models
import { RoleSchema } from '../models/role.model';

// Resources
import { BOT } from '../resources/roles';

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

export { getRole, promote };
