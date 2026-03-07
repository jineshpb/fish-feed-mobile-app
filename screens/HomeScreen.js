import { useState } from "react";
import { Alert, StyleSheet, View, ScrollView, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Header,
  VideoFeedPlaceholder,
  CamToggle,
  LastFeedText,
  ActionBar,
  MonoText,
} from "../components";
import { cameraClick, toggleCamera } from "../api/fishFeederApi";
import {
  API_TARGET,
  N8N_BASE_URL,
  N8N_LOCAL_BASE_URL,
  getApiTarget,
  setApiTarget,
} from "../api/config";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS } from "../theme/colors";

const MAX_SNAPSHOT_LOGS = 40;
const DEFAULT_RTSP_STREAM_URL = "rtsp://USER:PASS@10.0.0.108:554/stream1";
const DEFAULT_CAMERA_STREAM_URL = "";

const formatLogTime = (timestamp) => {
  const date = new Date(timestamp ?? Date.now());
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  return `${hours}:${minutes}:${seconds}`;
};

const obfuscateUrl = (rawUrl) => {
  if (!rawUrl || typeof rawUrl !== "string") return "url://***";

  try {
    const parsed = new URL(rawUrl);
    const obscuredHost = parsed.hostname
      .split(".")
      .map((segment) => {
        if (segment.length <= 2) return "**";
        return `${segment.slice(0, 1)}***${segment.slice(-1)}`;
      })
      .join(".");

    const obscuredPath = parsed.pathname
      .split("/")
      .filter(Boolean)
      .map((segment) => {
        if (segment.length <= 2) return "**";
        return `${segment.slice(0, 2)}***`;
      })
      .join("/");

    const queryPart = parsed.search ? "?***" : "";
    const pathPart = obscuredPath ? `/${obscuredPath}` : "";
    return `${parsed.protocol}//${obscuredHost}${pathPart}${queryPart}`;
  } catch {
    if (rawUrl.length <= 14) return "***";
    return `${rawUrl.slice(0, 8)}***${rawUrl.slice(-4)}`;
  }
};

const toSnapshotLogLine = (result) => {
  const action = String(result?.action ?? "event")
    .replace(/_/g, "-")
    .toUpperCase();
  const statusCode = result?.status ?? "--";
  const statusWord = result?.ok ? "OK" : "FAIL";
  const maskedUrl = obfuscateUrl(result?.url);
  return `${formatLogTime(result?.timestamp)}  ${action}  ${statusWord}/${statusCode}  ${maskedUrl}`;
};

export const HomeScreen = () => {
  const insets = useSafeAreaInsets();
  const [debugResult, setDebugResult] = useState(null);
  const [apiTarget, setApiTargetState] = useState(getApiTarget());
  const [snapshotPayload, setSnapshotPayload] = useState(null);
  const [snapshotLogs, setSnapshotLogs] = useState([]);
  const cameraStreamUrl =
    process.env.EXPO_PUBLIC_CAMERA_STREAM_URL || DEFAULT_CAMERA_STREAM_URL;
  const rtspStreamUrl =
    cameraStreamUrl ||
    process.env.EXPO_PUBLIC_RTSP_STREAM_URL ||
    DEFAULT_RTSP_STREAM_URL;

  const appendSnapshotLog = (result) => {
    setSnapshotLogs((prev) => {
      const next = [...prev, toSnapshotLogLine(result)];
      if (next.length <= MAX_SNAPSHOT_LOGS) return next;
      return next.slice(next.length - MAX_SNAPSHOT_LOGS);
    });
  };

  const handleDebugUpdate = (result) => {
    setDebugResult(result);
    appendSnapshotLog(result);
  };

  const handleSwitchApiTarget = (target) => {
    setApiTarget(target);
    setApiTargetState(getApiTarget());
    handleDebugUpdate({
      action: "api-target",
      ok: true,
      status: 200,
      error: null,
      url:
        target === API_TARGET.local && N8N_LOCAL_BASE_URL
          ? N8N_LOCAL_BASE_URL
          : N8N_BASE_URL,
      timestamp: Date.now(),
    });
  };

  const handleCameraToggle = async (isOn) => {
    const result = await toggleCamera(isOn);
    handleDebugUpdate({
      action: "camera-toggle",
      ...result,
      timestamp: Date.now(),
    });
    if (result.ok || result.error === "API not configured") return;
    const msg = result.url
      ? `${result.error ?? "Camera toggle failed"}\n\nURL: ${result.url}`
      : (result.error ?? "Camera toggle failed");
    Alert.alert("Error", msg);
  };

  const handleCameraClick = async () => {
    const result = await cameraClick();
    if (result.ok && result.status === 200) {
      setSnapshotPayload(result.data);
    }
    handleDebugUpdate({
      action: "snapshot",
      ...result,
      timestamp: Date.now(),
    });
    if (result.ok || result.error === "API not configured") return;
    const msg = result.url
      ? `${result.error ?? "Camera click failed"}\n\nURL: ${result.url}`
      : (result.error ?? "Camera click failed");
    Alert.alert("Error", msg);
  };

  const debugText = debugResult
    ? `[${debugResult.action}] ${debugResult.ok ? "OK" : "FAIL"} | status: ${debugResult.status ?? "-"}\n${debugResult.error ?? "no error"}\n${debugResult.url ?? "no url"}`
    : "No API requests yet.";

  return (
    <View style={styles.screen}>
      <LinearGradient
        colors={["#2F3439", "#191B1E"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFillObject}
        pointerEvents="none"
      />
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
          <VideoFeedPlaceholder
            onClickAction={handleCameraClick}
            snapshotPayload={snapshotPayload}
            apiLogLines={snapshotLogs}
            rtspUrl={rtspStreamUrl}
          />
          {/* <CamToggle onValueChange={handleCameraToggle} /> */}
          <LastFeedText />
          <ActionBar onDebugUpdate={handleDebugUpdate} />
          <View
            style={styles.apiPanel}
            accessibilityLabel="API target settings"
          >
            <MonoText style={styles.apiTitle}>API Target</MonoText>
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
                <MonoText
                  style={[
                    styles.apiButtonText,
                    apiTarget === API_TARGET.cloud &&
                      styles.apiButtonTextActive,
                  ]}
                >
                  Cloud
                </MonoText>
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
                <MonoText
                  style={[
                    styles.apiButtonText,
                    apiTarget === API_TARGET.local &&
                      styles.apiButtonTextActive,
                  ]}
                >
                  Local
                </MonoText>
              </Pressable>
            </View>
            <MonoText style={styles.apiUrlLabel}>
              Active URL:{" "}
              {apiTarget === API_TARGET.local && N8N_LOCAL_BASE_URL
                ? N8N_LOCAL_BASE_URL
                : N8N_BASE_URL || "Not configured"}
            </MonoText>
          </View>
          <View
            style={styles.debugBanner}
            accessibilityLabel="API debug banner"
          >
            <MonoText style={styles.debugTitle}>API DEBUG</MonoText>
            <MonoText style={styles.debugBody}>{debugText}</MonoText>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#efefef",
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 15,
    alignItems: "center",
  },
  content: {
    width: "100%",
    maxWidth: 356,
    alignItems: "center",
  },
  apiPanel: {
    width: "100%",
    marginTop: 44,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.skeuo.cardBorder1,
    backgroundColor: COLORS.skeuo.trackSurface,
  },
  apiTitle: {
    fontSize: 11,
    fontWeight: "700",
    color: COLORS.base.white,
    marginBottom: 8,
  },
  apiButtonsRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 8,
  },
  apiButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.skeuo.cardBorder1,
    borderRadius: 10,
    paddingVertical: 8,
    alignItems: "center",
    backgroundColor: COLORS.skeuo.panelSurface,
  },
  apiButtonActive: {
    borderColor: COLORS.base.white,
    backgroundColor: COLORS.skeuo.cardBorder1,
  },
  apiButtonText: {
    fontSize: 12,
    color: COLORS.skeuo.labelText,
    fontWeight: "600",
  },
  apiButtonTextActive: {
    color: COLORS.base.white,
  },
  apiUrlLabel: {
    fontSize: 11,
    lineHeight: 16,
    color: COLORS.skeuo.labelText,
  },
  debugBanner: {
    width: "100%",
    marginTop: 12,
    marginBottom: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.skeuo.cardBorder1,
    backgroundColor: COLORS.skeuo.trackSurface,
  },
  debugTitle: {
    fontSize: 11,
    fontWeight: "700",
    color: COLORS.base.white,
    marginBottom: 6,
  },
  debugBody: {
    fontSize: 11,
    lineHeight: 16,
    color: COLORS.skeuo.labelText,
  },
});
