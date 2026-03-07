import { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, View } from 'react-native';
import { ActionButton } from './ActionButton';
import { feedFish, toggleLights, cameraClick } from '../api/fishFeederApi';

const RECONCILE_INTERVAL_MS = 10000;
const POST_TOGGLE_RECONCILE_DELAY_MS = 700;

const showError = (result, fallback) => {
  if (result.ok || result.error === 'API not configured') return;
  const msg = result.url
    ? `${result.error ?? fallback}\n\nURL: ${result.url}`
    : result.error ?? fallback;
  Alert.alert('Error', msg);
};

export const ActionBar = ({ onDebugUpdate }) => {
  const [lightsActive, setLightsActive] = useState(false);
  const [lightsSurfaceActive, setLightsSurfaceActive] = useState(false);
  const [successFlash, setSuccessFlash] = useState({ feed: false, click: false });
  const [loadingState, setLoadingState] = useState({
    feed: false,
    lights: false,
    click: false,
  });
  const flashTimeoutsRef = useRef({ feed: null, click: null });
  const reconcileTimeoutRef = useRef(null);

  const pushDebug = (action, result) => {
    onDebugUpdate?.({ action, ...result, timestamp: Date.now() });
  };

  const flashSuccess = (key) => {
    const timeoutId = flashTimeoutsRef.current[key];
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    setSuccessFlash((prev) => ({ ...prev, [key]: true }));
    flashTimeoutsRef.current[key] = setTimeout(() => {
      setSuccessFlash((prev) => ({ ...prev, [key]: false }));
    }, 450);
  };

  const parseBooleanLike = (value) => {
    if (typeof value === 'boolean') return value;
    if (typeof value === 'number') {
      if (value === 1) return true;
      if (value === 0) return false;
    }
    if (typeof value === 'string') {
      const normalized = value.trim().toLowerCase();
      if (['true', 'on', 'enabled', '1'].includes(normalized)) return true;
      if (['false', 'off', 'disabled', '0'].includes(normalized)) return false;
    }
    return null;
  };

  const extractLightsStateFromSnapshot = (payload) => {
    const knownCandidates = [
      payload?.ledOn,
      payload?.led_on,
      payload?.lightOn,
      payload?.lightsOn,
      payload?.isLedOn,
      payload?.isLightOn,
      payload?.state?.ledOn,
      payload?.state?.lightsOn,
      payload?.state?.lightOn,
      payload?.data?.ledOn,
      payload?.data?.lightsOn,
      payload?.output?.ledOn,
      payload?.output?.lightsOn,
    ];

    for (const value of knownCandidates) {
      const parsed = parseBooleanLike(value);
      if (parsed !== null) return parsed;
    }

    const scanRecursive = (value) => {
      if (value === null || value === undefined) return null;
      if (Array.isArray(value)) {
        for (const item of value) {
          const parsed = scanRecursive(item);
          if (parsed !== null) return parsed;
        }
        return null;
      }
      if (typeof value === 'object') {
        for (const [key, nestedValue] of Object.entries(value)) {
          if (/(led|light)/i.test(key)) {
            const parsed = parseBooleanLike(nestedValue);
            if (parsed !== null) return parsed;
          }
        }
        for (const nestedValue of Object.values(value)) {
          const parsed = scanRecursive(nestedValue);
          if (parsed !== null) return parsed;
        }
      }
      return null;
    };

    return scanRecursive(payload);
  };

  const reconcileLightsFromSnapshot = useCallback(async (source) => {
    const result = await cameraClick();
    pushDebug(`snapshot-${source}`, result);
    if (!(result.ok && result.status === 200)) return;

    const snapshotLightsState = extractLightsStateFromSnapshot(result.data);
    if (typeof snapshotLightsState !== 'boolean') return;

    setLightsActive(snapshotLightsState);
    setLightsSurfaceActive(snapshotLightsState);
  }, []);

  const schedulePostToggleReconcile = useCallback(() => {
    if (reconcileTimeoutRef.current) {
      clearTimeout(reconcileTimeoutRef.current);
    }

    reconcileTimeoutRef.current = setTimeout(() => {
      reconcileLightsFromSnapshot('post-toggle');
    }, POST_TOGGLE_RECONCILE_DELAY_MS);
  }, [reconcileLightsFromSnapshot]);

  useEffect(() => {
    reconcileLightsFromSnapshot('initial');

    const intervalId = setInterval(() => {
      reconcileLightsFromSnapshot('interval');
    }, RECONCILE_INTERVAL_MS);

    return () => {
      clearInterval(intervalId);
    };
  }, [reconcileLightsFromSnapshot]);

  useEffect(
    () => () => {
      Object.values(flashTimeoutsRef.current).forEach((timeoutId) => {
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
      });
      if (reconcileTimeoutRef.current) {
        clearTimeout(reconcileTimeoutRef.current);
      }
    },
    [],
  );

  const handleFeed = async () => {
    setLoadingState((prev) => ({ ...prev, feed: true }));
    const result = await feedFish();
    pushDebug('feed', result);
    showError(result, 'Feed request failed');
    setLoadingState((prev) => ({ ...prev, feed: false }));
    if (result.ok && result.status === 200) {
      flashSuccess('feed');
    }
  };

  const handleLights = async (value) => {
    if (loadingState.lights) return;

    setLightsSurfaceActive(value);
    setLoadingState((prev) => ({ ...prev, lights: true }));
    const result = await toggleLights(value, {
      currentKnownState: lightsActive,
      requestId: String(Date.now()),
      sentAt: new Date().toISOString(),
    });
    pushDebug('lights', result);

    if (result.ok && result.status === 200) {
      setLightsActive(value);
      setLightsSurfaceActive(value);
      schedulePostToggleReconcile();
    } else {
      // Revert depth on failure to match confirmed state.
      setLightsSurfaceActive(lightsActive);
    }

    showError(result, 'Lights request failed');
    setLoadingState((prev) => ({ ...prev, lights: false }));
  };

  const handleClick = async () => {
    setLoadingState((prev) => ({ ...prev, click: true }));
    const result = await cameraClick();
    pushDebug('snapshot', result);
    showError(result, 'Camera click failed');
    setLoadingState((prev) => ({ ...prev, click: false }));
    if (result.ok && result.status === 200) {
      flashSuccess('click');
    }
  };

  return (
    <View className="flex-row w-full gap-4" accessibilityLabel="Feed, lights, and camera actions">
      <ActionButton
        label="feed"
        iconKey="feed"
        variant="push"
        forceActive={successFlash.feed}
        loading={loadingState.feed}
        onPress={handleFeed}
      />
      <ActionButton
        label="lights"
        iconKey="lights"
        variant="toggle"
        active={lightsActive}
        surfaceActive={lightsSurfaceActive}
        ledActive={lightsActive}
        loading={loadingState.lights}
        onPress={handleLights}
      />
      <ActionButton
        label="click"
        iconKey="click"
        variant="push"
        forceActive={successFlash.click}
        loading={loadingState.click}
        onPress={handleClick}
      />
    </View>
  );
};
