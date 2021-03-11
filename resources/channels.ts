import { ChannelSchema } from '../models/channel.model';

const EVENTS: ChannelSchema = {
  name: 'events',
  options: {
    permissions: {
      SEND_MESSAGES: false,
      SEND_TTS_MESSAGES: false,
      MANAGE_MESSAGES: false,
      EMBED_LINKS: false,
      ATTACH_FILES: false,
      MENTION_EVERYONE: false,
      VIEW_CHANNEL: true,
      USE_EXTERNAL_EMOJIS: true,
      ADD_REACTIONS: true,
      READ_MESSAGE_HISTORY: true
    },
    position: 1,
    type: 'text'
  }
};

const INFORMATION: ChannelSchema = {
  name: 'information',
  options: {
    permissions: {
      SEND_MESSAGES: false,
      SEND_TTS_MESSAGES: false,
      MANAGE_MESSAGES: false,
      EMBED_LINKS: false,
      ATTACH_FILES: false,
      MENTION_EVERYONE: false,
      VIEW_CHANNEL: true,
      USE_EXTERNAL_EMOJIS: true,
      ADD_REACTIONS: true,
      READ_MESSAGE_HISTORY: true
    },
    position: 0,
    type: 'category'
  }
};

const RULES: ChannelSchema = {
  name: 'rules',
  options: {
    permissions: {
      SEND_MESSAGES: false,
      SEND_TTS_MESSAGES: false,
      MANAGE_MESSAGES: false,
      EMBED_LINKS: false,
      ATTACH_FILES: false,
      MENTION_EVERYONE: false,
      VIEW_CHANNEL: true,
      USE_EXTERNAL_EMOJIS: true,
      ADD_REACTIONS: true,
      READ_MESSAGE_HISTORY: true
    },
    position: 0,
    type: 'text'
  }
};

export { EVENTS, INFORMATION, RULES };
