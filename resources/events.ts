import { GameEvent } from '../models/event.model';

const GAME_EVENTS: GameEvent[] = [
  {
    embed: {
      color: 'RANDOM',
      footer: {
        text: 'A: Kill the Time Being\nB: Run'
      },
      image: {
        url: 'https://i.redd.it/8ch9upfzav321.png'
      },
      title: 'The Time Being stands before you.'
    },
    choices: {
      A: `You can't kill The Time Being, are you crazy?`,
      B: `Good choice.`
    }
  },
  {
    embed: {
      color: 'RANDOM',
      title: `Holy crud it's Iggy McQueen!`,
      image: {
        url:
          'https://lh3.googleusercontent.com/0PgaLTPsN_7nOIj8yjFl0VaDKc_Zi-S1BorEXbc0th7cynhi0_OjLzHWgIN7BBQzNQ5PanfLEimwjkNxxF_oGrJbK-hBIUU4EXSX58PkrIXyMJ_2H0Jhaq7b1MbI3BkvOPlxxrm57pVh_42fxB7rfM36tgo0VfNLFo4R4T7mucYM6b7_T6VwLFZF4CkfONUPnkj-9aCV0DV79AkNA3ZmECe8IHlPjytIDibhzrLf_cUd4wlzxzCgrEt-Z5PoFMHqHX3M86DbjEtKpWzFMxkIjFWhz5KXnu7sMD_QHFL0mKVw7FBr-T4QiozYNclgFXrulI7aEIe8lGX89uhd1s58aqYC2Yq5ljkebQjK0W8PTRglEMGftTJGPCZeuuoJqjmLn-s9T4inxya_RW3cJ-4ruljAfVgtuIRQ0YGT351LVnHDEZ4LR_VW02hgikgha2XALAL-Aqo5waIBWbFEDhSdgrxS3OVlxDYTRWjqpbhglV3ZgF3bmEu5KJ0nHjPh0nkvLbVkL0voX-oiABIF7wZc5APy3SSuuMw7b6Hev0vwYOQdo1FfdfAKgr6I4kzb9dCQbfNS8jSLj39b_c_dyPgWofVVmpI8qFM8rB5Hh25PfJTnEwnTcz2DCtq0NzZLrfh4OcTaHNmXLKYsxBi0uh4lGd1hSEKaT45RnxQprEjXrOphcSRybz9BxunY2gIpH9amlN8sr_aTjUdFVeg7UIDH7t8C=w497-h881-no?authuser=0'
      },
      footer: {
        text: 'A: Pet Iggy.'
      }
    },
    choices: {
      A: `You pet Iggy. Iggy's love stats went up by 5 points.`
    }
  },
  {
    embed: {
      color: 'RANDOM',
      title: 'An Alot appears before you!',
      image: {
        url: 'http://4.bp.blogspot.com/_D_Z-D2tzi14/S8TRIo4br3I/AAAAAAAACv4/Zh7_GcMlRKo/s280/ALOT.png'
      },
      footer: {
        text: 'A: Stab it alot!\nB: Give it alot of cuddles?'
      }
    },
    choices: {
      A: 'You stab the Alot! And the Alot bites you! You both fight alot.',
      B: `You cuddle the Alot, it likes it, it becomes your friend. The Alot's friendship status went up by alot.`
    }
  }
];

export { GAME_EVENTS };
