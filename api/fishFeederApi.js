import { N8N_API_KEY, N8N_WEBHOOK_PATHS, getN8nBaseUrl } from "./config";

const callWebhook = async (path, options = {}) => {
  const { method = "POST", body } = options;
  const baseUrl = getN8nBaseUrl();

  if (!baseUrl) {
    console.warn("N8N_BASE_URL not set. Add EXPO_PUBLIC_N8N_BASE_URL to .env");
    return { ok: false, error: "API not configured", url: null };
  }

  const url = `${baseUrl}/webhook/${path}`;

  try {
    const headers = {
      "Content-Type": "application/json",
      ...(N8N_API_KEY ? { "x-api-key": N8N_API_KEY } : {}),
    };

    const fetchOptions = {
      method,
      headers,
      ...(body !== undefined && method !== "GET" && { body: JSON.stringify(body) }),
    };

    const response = await fetch(url, fetchOptions);
    const rawText = await response.text();

    let data = {};
    if (rawText) {
      try {
        data = JSON.parse(rawText);
      } catch {
        data = rawText;
      }
    }

    if (!response.ok) {
      const msg = data?.message ?? data?.error ?? `HTTP ${response.status}`;
      return {
        ok: false,
        error: msg,
        status: response.status,
        url,
        data,
      };
    }

    return { ok: true, status: response.status, data, url };
  } catch (err) {
    const isNetwork =
      err?.message?.includes("Network") ||
      err?.message?.includes("fetch") ||
      err?.name === "TypeError";
    const error = isNetwork
      ? `Network error: ${err.message}. Check URL and connectivity.`
      : err.message;
    console.error(`n8n webhook [${path}]:`, err);
    return { ok: false, error, url };
  }
};

export const feedFish = () =>
  callWebhook(N8N_WEBHOOK_PATHS.feed, { body: { action: "feed" } });

export const toggleLights = (value, metadata = {}) =>
  callWebhook(N8N_WEBHOOK_PATHS.lights, {
    body: { action: "lights", value, ...metadata },
  });

export const getSnapshot = () =>
  callWebhook(N8N_WEBHOOK_PATHS.snapshot, { method: "GET" });

export const cameraClick = () => getSnapshot();

export const getFishStatus = () =>
  callWebhook(N8N_WEBHOOK_PATHS.status, { method: "GET" });

export const toggleCamera = (isOn) =>
  callWebhook(N8N_WEBHOOK_PATHS.cameraToggle, {
    body: {
      action: "camera-toggle",
      value: isOn,
    },
  });
