export default {
  ...require("./app.json").expo,
  plugins: [
    ...(require("./app.json").expo.plugins ?? []),
    "expo-video",
  ],
  extra: {
    ...require("./app.json").expo.extra,
    n8nBaseUrl: process.env.EXPO_PUBLIC_N8N_BASE_URL?.replace(/\/$/, "") ?? "",
    n8nLocalBaseUrl:
      process.env.EXPO_PUBLIC_N8N_LOCAL_BASE_URL?.replace(/\/$/, "") ?? "",
    n8nApiKey: process.env.EXPO_PUBLIC_N8N_API_KEY ?? "",
    // Override if your n8n webhooks use different paths (e.g. UUIDs)
    n8nWebhookPaths: {
      feed: "fish/feed",
      lights: "fish/led",
      status: "fish/status",
      cameraClick: "fish/snapshot",
      snapshot: "fish/snapshot",
      cameraToggle: "fish/camera-toggle",
    },
  },
};
