import { ENTITY_TYPES } from '../constants.js';

export default {
  id: "snakes",
  entities: [
    {
      id: "corn_snake",
      name: "Corn Snake",
      type: ENTITY_TYPES.SNAKE,
      description: "A friendly, easy-to-care-for snake perfect for beginners.",
      image: "assets/corn_snake.png",
      care_profile: "corn_standard",
      initial_care: { hunger: 100, clean: 100 }
    },
    {
      id: "king_snake",
      name: "King Snake",
      type: ENTITY_TYPES.SNAKE,
      description: "A hardy snake with calm temperament.",
      image: "assets/king_snake.png",
      care_profile: "king_standard",
      initial_care: { hunger: 100, clean: 100 }
    }
  ],
  // care profiles keyed by id. Values are pure data describing decay and min.
  care_profiles: {
    corn_standard: {
      // decay per 'tick' (MVP: applied on page load)
      hunger: { decay: 5, min: 0 },
      clean: { decay: 2, min: 0 }
    },
    king_standard: {
      hunger: { decay: 3, min: 0 },
      clean: { decay: 1, min: 0 }
    }
  },
  ui: {
    icon: "🐍",
    color: "#7bb26b"
  }
};
