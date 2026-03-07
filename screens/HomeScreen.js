import { useState } from 'react';
import { Alert, StyleSheet, View, ScrollView, Text, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Header,
  VideoFeedPlaceholder,
  CamToggle,
  LastFeedText,
  ActionBar,
} from '../components';
import { toggleCamera } from '../api/fishFeederApi';
import {
  API_TARGET,
  N8N_BASE_URL,
  N8N_LOCAL_BASE_URL,
  getApiTarget,
  setApiTarget,
} from '../api/config';

export const HomeScreen = () => {
  const insets = useSafeAreaInsets();
  const [debugResult, setDebugResult] = useState(null);
  const [apiTarget, setApiTargetState] = useState(getApiTarget());

  const handleDebugUpdate = (result) => {
    setDebugResult(result);
  };

  const handleSwitchApiTarget = (target) => {
    setApiTarget(target);
    setApiTargetState(getApiTarget());
    setDebugResult((prev) => ({
      action: 'api-target',
      ok: true,
      status: 200,
      error: null,
      url:
        target === API_TARGET.local && N8N_LOCAL_BASE_URL
          ? N8N_LOCAL_BASE_URL
          : N8N_BASE_URL,
      timestamp: Date.now(),
    }));
  };

  const handleCameraToggle = async (isOn) => {
    const result = await toggleCamera(isOn);
    handleDebugUpdate({ action: 'camera-toggle', ...result, timestamp: Date.now() });
    if (result.ok || result.error === 'API not configured') return;
    const msg = result.url
      ? `${result.error ?? 'Camera toggle failed'}\n\nURL: ${result.url}`
      : result.error ?? 'Camera toggle failed';
    Alert.alert('Error', msg);
  };

  const debugText = debugResult
    ? `[${debugResult.action}] ${debugResult.ok ? 'OK' : 'FAIL'} | status: ${debugResult.status ?? '-'}\n${debugResult.error ?? 'no error'}\n${debugResult.url ?? 'no url'}`
    : 'No API requests yet.';

  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: insets.top,
            paddingBottom: insets.bottom,
          },
        ]}
        showsVerticalScrollIndicator={false}
        accessibilityLabel="BLUEFY home screen"
      >
        <View style={styles.content}>
          <Header />
          <VideoFeedPlaceholder />
          <CamToggle onValueChange={handleCameraToggle} />
          <LastFeedText />
          <ActionBar onDebugUpdate={handleDebugUpdate} />
          <View style={styles.apiPanel} accessibilityLabel="API target settings">
            <Text style={styles.apiTitle}>API Target</Text>
            <View style={styles.apiButtonsRow}>
              <Pressable
                style={[
                  styles.apiButton,
                  apiTarget === API_TARGET.cloud && styles.apiButtonActive,
                ]}
                onPress={() => handleSwitchApiTarget(API_TARGET.cloud)}
                accessibilityRole="button"
                accessibilityLabel="Switch API target to cloud"
              >
                <Text
                  style={[
                    styles.apiButtonText,
                    apiTarget === API_TARGET.cloud && styles.apiButtonTextActive,
                  ]}
                >
                  Cloud
                </Text>
              </Pressable>
              <Pressable
                style={[
                  styles.apiButton,
                  apiTarget === API_TARGET.local && styles.apiButtonActive,
                ]}
                onPress={() => handleSwitchApiTarget(API_TARGET.local)}
                accessibilityRole="button"
                accessibilityLabel="Switch API target to local network"
              >
                <Text
                  style={[
                    styles.apiButtonText,
                    apiTarget === API_TARGET.local && styles.apiButtonTextActive,
                  ]}
                >
                  Local
                </Text>
              </Pressable>
            </View>
            <Text style={styles.apiUrlLabel}>
              Active URL:{' '}
              {apiTarget === API_TARGET.local && N8N_LOCAL_BASE_URL
                ? N8N_LOCAL_BASE_URL
                : N8N_BASE_URL || 'Not configured'}
            </Text>
          </View>
          <View style={styles.debugBanner} accessibilityLabel="API debug banner">
            <Text style={styles.debugTitle}>API DEBUG</Text>
            <Text style={styles.debugBody}>{debugText}</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#efefef',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 15,
    alignItems: 'center',
  },
  content: {
    width: '100%',
    maxWidth: 356,
    alignItems: 'center',
  },
  apiPanel: {
    width: '100%',
    marginTop: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#d1d1d1',
    backgroundColor: '#fafafa',
  },
  apiTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#6a6a6a',
    marginBottom: 8,
  },
  apiButtonsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  apiButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#d1d1d1',
    borderRadius: 10,
    paddingVertical: 8,
    alignItems: 'center',
    backgroundColor: '#f4f4f4',
  },
  apiButtonActive: {
    borderColor: '#7a7a7a',
    backgroundColor: '#e8e8e8',
  },
  apiButtonText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
  },
  apiButtonTextActive: {
    color: '#3b3b3b',
  },
  apiUrlLabel: {
    fontSize: 11,
    lineHeight: 16,
    color: '#4d4d4d',
  },
  debugBanner: {
    width: '100%',
    marginTop: 12,
    marginBottom: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#d1d1d1',
    backgroundColor: '#fafafa',
  },
  debugTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#6a6a6a',
    marginBottom: 6,
  },
  debugBody: {
    fontSize: 11,
    lineHeight: 16,
    color: '#4d4d4d',
  },
});
