# Fish Feeder API (n8n Webhooks)

The app calls n8n webhook endpoints for actions.

## Setup

1. Copy `.env.example` to `.env`
2. Set `EXPO_PUBLIC_N8N_BASE_URL` to your n8n instance (e.g. `https://n8n.jdawg.xyz`)
3. Restart Expo with cache clear: `npx expo start --clear`
4. Ensure n8n workflows are **activated** (not just saved) so production webhooks are live

## Webhook paths

Create workflows in n8n with Webhook triggers at these paths:

| Path          | Body                         | Triggered by      |
|---------------|------------------------------|-------------------|
| `/webhook/feed`        | `{ action: "feed" }`         | Feed button       |
| `/webhook/lights`      | `{ action: "lights", value: boolean }` | Lights toggle |
| `/webhook/camera-click`| `{ action: "camera-click" }` | Camera click btn  |
| `/webhook/camera-toggle` | `{ action: "camera-toggle", value: boolean }` | Cam toggle |

## n8n workflow example

1. Add a **Webhook** node (trigger)
2. Method: POST
3. Path: `feed` (or `lights`, `camera-click`, `camera-toggle`)
4. Add a **Respond to Webhook** node to return `{ success: true }`
5. **Activate** the workflow (production webhooks only work when active)

## Custom webhook paths

If your n8n workflow uses different paths (e.g. UUIDs like `abc-123-def`), add to `app.config.js`:

```js
extra: {
  n8nWebhookPaths: {
    feed: 'your-feed-webhook-id',
    lights: 'your-lights-webhook-id',
    cameraClick: 'your-camera-click-id',
    cameraToggle: 'your-camera-toggle-id',
  },
},
```

## Troubleshooting

- **"API not configured"** → Restart with `npx expo start --clear`, ensure `.env` has `EXPO_PUBLIC_N8N_BASE_URL`
- **404 / "Feed request failed"** → Check the URL in the error alert. Your n8n webhook path may differ — override via `n8nWebhookPaths`
- **Network error** → Device and n8n must be reachable (same network, CORS if web)
