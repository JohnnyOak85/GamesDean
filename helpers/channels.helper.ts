import { GuildChannel, GuildChannelManager, Role, TextChannel } from 'discord.js';
import { PermissionList } from '../models/role.model';
import { logInfo } from './logs.helper';

/**
 * @description Creates a new channel on the guild.
 * @param channelManager
 * @param channelSchema
 */
const createChannel = async (
  channelManager: GuildChannelManager | undefined,
  channelSchema: ChannelSchema,
  systemChannel: TextChannel | null | undefined
): Promise<GuildChannel | undefined> => {
  try {
    if (!channelManager) return;

    const channel = await channelManager.create(channelSchema.name, {
      type: channelSchema.type
    });

    systemChannel?.send(`Created new channel <#${channel?.id}>!`);
    logInfo(`Created channel ${channelSchema.name} on ${channelManager?.guild.name}.`);

    return channel;
  } catch (error) {
    throw error;
  }
};

/**
 * @description Retrieves a new channel from the guild.
 * @param channelManager
 * @param channelSchema
 */
const getChannel = async (
  channelManager: GuildChannelManager | undefined,
  channelSchema: ChannelSchema,
  systemChannel: TextChannel | null | undefined
): Promise<GuildChannel | void> => {
  try {
    if (!channelManager) return;
    
    const channel = channelManager.cache.find((guildChannel) => guildChannel.name === channelSchema.name);

    if (!channel) return await createChannel(channelManager, channelSchema, systemChannel);

    return channel;
  } catch (error) {
    throw error;
  }
};

/**
 * @description Updates every channels permissions.
 * @param channelManager
 * @param role
 * @param permissions
 */
const updateChannelsPermissions = async (
  channelManager: GuildChannelManager,
  role: Role,
  permissions: PermissionList,
  systemChannel: TextChannel | null | undefined
): Promise<void> => {
  try {
    for (const channel of channelManager.cache.array()) {
      await channel.updateOverwrite(role, permissions);

      systemChannel?.send(`Updated permissions for <#${channel.id}>!`);
      logInfo(`Updated permissions for channel ${channel.name} of ${channelManager.guild.name}.`);
    }
  } catch (error) {
    throw error;
  }
};

export { createChannel, getChannel, updateChannelsPermissions };
