import Constants from 'expo-constants';

const extra = Constants.expoConfig?.extra ?? {};
const envUrl =
  typeof process !== 'undefined' && process.env?.EXPO_PUBLIC_N8N_BASE_URL
    ? String(process.env.EXPO_PUBLIC_N8N_BASE_URL).replace(/\/$/, '')
    : '';
const envLocalUrl =
  typeof process !== 'undefined' && process.env?.EXPO_PUBLIC_N8N_LOCAL_BASE_URL
    ? String(process.env.EXPO_PUBLIC_N8N_LOCAL_BASE_URL).replace(/\/$/, '')
    : '';
const envApiKey =
  typeof process !== 'undefined' && process.env?.EXPO_PUBLIC_N8N_API_KEY
    ? String(process.env.EXPO_PUBLIC_N8N_API_KEY)
    : '';

/**
 * n8n base URL. Set EXPO_PUBLIC_N8N_BASE_URL in .env
 */
export const N8N_BASE_URL = extra.n8nBaseUrl || envUrl;
export const N8N_LOCAL_BASE_URL = extra.n8nLocalBaseUrl || envLocalUrl;
export const N8N_API_KEY = extra.n8nApiKey || envApiKey;

export const API_TARGET = {
  cloud: 'cloud',
  local: 'local',
};

let selectedApiTarget = API_TARGET.cloud;

export const setApiTarget = (target) => {
  if (target === API_TARGET.local || target === API_TARGET.cloud) {
    selectedApiTarget = target;
  }
};

export const getApiTarget = () => selectedApiTarget;

export const getN8nBaseUrl = () => {
  if (selectedApiTarget === API_TARGET.local && N8N_LOCAL_BASE_URL) {
    return N8N_LOCAL_BASE_URL;
  }
  return N8N_BASE_URL;
};

/**
 * Webhook path suffixes. Override in app.config.js extra.n8nWebhookPaths
 * if your n8n workflow uses different paths (e.g. UUIDs).
 */
export const N8N_WEBHOOK_PATHS = {
  feed: extra.n8nWebhookPaths?.feed ?? 'feed',
  lights: extra.n8nWebhookPaths?.lights ?? 'lights',
  status: extra.n8nWebhookPaths?.status ?? 'status',
  cameraClick: extra.n8nWebhookPaths?.cameraClick ?? 'camera-click',
  cameraToggle: extra.n8nWebhookPaths?.cameraToggle ?? 'camera-toggle',
  snapshot:
    extra.n8nWebhookPaths?.snapshot ??
    extra.n8nWebhookPaths?.cameraClick ??
    'snapshot',
};
