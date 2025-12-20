export default {
  id: "dex",
  ui: {
    title: "Dex",
    description: "Shows owned and locked creatures"
  },
  // Dex plugin is data/UI only; rendering is controlled by core/UI code.
  metadata: {
    columns: ["Name", "Type", "Status"]
  }
};
