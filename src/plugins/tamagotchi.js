export default {
  id: "tamagotchi",
  // Actions here are labels and UI metadata only. Core implements the logic.
  actions: [
    { id: "feed", label: "Feed", description: "Refill hunger to full" },
    { id: "clean", label: "Clean", description: "Restore cleanliness to full" }
  ],
  ui: {
    helpText: "Perform actions to care for your pets. Actions do not contain logic in plugins."
  }
};
