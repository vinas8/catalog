import { ENTITY_TYPES } from '../constants.js';

export default {
  id: "plants",
  entities: [
    {
      id: "fern_plant",
      name: "Fern",
      type: ENTITY_TYPES.PLANT,
      description: "A decorative fern (future expansion)",
      image: "assets/fern.png",
      care_profile: "fern_standard",
      initial_care: { hunger: 100, clean: 100 }
    }
  ],
  care_profiles: {
    fern_standard: {
      hunger: { decay: 1, min: 0 },
      clean: { decay: 0.5, min: 0 }
    }
  },
  ui: { icon: "🌿" }
};
