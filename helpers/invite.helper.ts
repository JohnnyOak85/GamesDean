import { Collection, Invite } from 'discord.js';

const getInvite = (inviteList: Collection<string, Invite> | undefined) => {
  try {
    if (!inviteList) return;
    
    const filteredInvite = inviteList.filter((invite) => !invite.temporary);

    return filteredInvite.array()[0];
  } catch (error) {
    throw error;
  }
};

export { getInvite };
