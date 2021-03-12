import { Embed, GameEvent } from '../models/event.model';
import { GAME_EVENTS } from '../resources/events';

const getEvent = () => {
  const index = Math.floor(Math.random() * GAME_EVENTS.length);
  return GAME_EVENTS[index];
};

let event: GameEvent | null;
let reply: string | Embed;

const throwEvent = (choice: string) => {
  if (!event && !choice) {
    event = getEvent();
    return { embed: event.embed };
  }

  if (event && choice) {
    reply = event.choices[choice];

    if (!reply) return;

    event = null;
    return reply;
  }
};

export { throwEvent };
