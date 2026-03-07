import { useEffect, useRef, useState } from "react";
import { StyleSheet, View, Pressable, Image, ScrollView, Platform } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useVideoPlayer, VideoView } from "expo-video";
import { COLORS } from "../theme/colors";
import { MonoText } from "./MonoText";

export const VideoFeedPlaceholder = ({
  defaultToggleValue = false,
  onToggleChange,
  onClickAction,
  snapshotPayload,
  apiLogLines = [],
  rtspUrl = "",
}) => {
  const [isOn, setIsOn] = useState(defaultToggleValue);
  const logScrollRef = useRef(null);
  const [streamError, setStreamError] = useState(null);
  const hasRtspStream = typeof rtspUrl === "string" && rtspUrl.trim().length > 0;
  const normalizedStreamUrl = typeof rtspUrl === "string" ? rtspUrl.trim() : "";
  const isRtspSource = normalizedStreamUrl.toLowerCase().startsWith("rtsp://");
  const isIosRtspUnsupported = Platform.OS === "ios" && isRtspSource;
  const shouldRenderVideoView = hasRtspStream && !isIosRtspUnsupported;
  const videoPlayer = useVideoPlayer(hasRtspStream ? { uri: rtspUrl } : null, (player) => {
    player.loop = true;
    player.muted = true;
  });

  const extractSnapshotUri = (payload) => {
    if (!payload) return null;

    if (typeof payload === "string") {
      const trimmed = payload.trim();
      if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
        return trimmed;
      }
      if (trimmed.startsWith("data:image/")) {
        return trimmed;
      }
      if (trimmed.length > 128 && !trimmed.includes(" ")) {
        return `data:image/jpeg;base64,${trimmed}`;
      }
      return null;
    }

    const entries = Array.isArray(payload) ? payload : [payload];

    for (const entry of entries) {
      if (!entry || typeof entry !== "object") continue;

      const candidates = [
        entry.imageUrl,
        entry.image_url,
        entry.snapshotUrl,
        entry.snapshot_url,
        entry.url,
        entry.image,
        entry.snapshot,
        entry.data?.imageUrl,
        entry.data?.image_url,
        entry.data?.snapshotUrl,
        entry.data?.snapshot_url,
        entry.data?.url,
        entry.data?.image,
        entry.data?.snapshot,
      ];

      if (typeof entry.data === "string") {
        const base64Value = entry.data.trim();
        if (
          base64Value.startsWith("http://") ||
          base64Value.startsWith("https://")
        ) {
          candidates.push(base64Value);
        } else if (base64Value.startsWith("data:image/")) {
          candidates.push(base64Value);
        } else if (base64Value.length > 128 && !base64Value.includes(" ")) {
          const mimeType =
            typeof entry.mimeType === "string" &&
            entry.mimeType.startsWith("image/")
              ? entry.mimeType
              : "image/jpeg";
          candidates.push(`data:${mimeType};base64,${base64Value}`);
        }
      }

      for (const candidate of candidates) {
        if (typeof candidate !== "string") continue;
        const trimmed = candidate.trim();
        if (!trimmed) continue;
        if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
          return trimmed;
        }
        if (trimmed.startsWith("data:image/")) {
          return trimmed;
        }
        if (trimmed.length > 128 && !trimmed.includes(" ")) {
          return `data:image/jpeg;base64,${trimmed}`;
        }
      }
    }

    return null;
  };

  const snapshotUri = extractSnapshotUri(snapshotPayload);
  const lines =
    apiLogLines.length > 0
      ? apiLogLines
      : ["SYS:// idle // waiting for API traffic"];
  const isVideoMode = isOn;

  useEffect(() => {
    if (!videoPlayer) return;
    if (isVideoMode && shouldRenderVideoView) {
      videoPlayer.play();
      return;
    }
    videoPlayer.pause();
  }, [videoPlayer, isVideoMode, shouldRenderVideoView]);

  useEffect(() => {
    if (!videoPlayer) return undefined;
    const subscription = videoPlayer.addListener("statusChange", (event) => {
      if (event.status === "error") {
        setStreamError("Unable to load RTSP stream in this player.");
        return;
      }
      if (event.status === "readyToPlay") {
        setStreamError(null);
      }
    });

    return () => {
      subscription.remove();
    };
  }, [videoPlayer]);

  useEffect(() => {
    if (!logScrollRef.current) return;
    logScrollRef.current.scrollToEnd({ animated: true });
  }, [lines]);

  const handleTogglePress = () => {
    const nextValue = !isOn;
    setIsOn(nextValue);
    setStreamError(null);
    onToggleChange?.(nextValue);
    if (!nextValue) {
      // Switched to snapshot mode.
      onClickAction?.(nextValue);
    }
  };

  return (
    <View
      className="w-full h-[375px] border-[2px] border-[#1E2024] rounded-[30px] overflow-hidden mb-[10px]"
      accessibilityLabel="Camera feed placeholder"
    >
      <LinearGradient
        colors={["#131415", "#1A1C1E"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFillObject}
        pointerEvents="none"
      />

      <View style={styles.innerShadow} />
      {isVideoMode && shouldRenderVideoView ? (
        <>
          <VideoView
            player={videoPlayer}
            style={styles.snapshotImage}
            contentFit="cover"
            nativeControls={false}
            accessibilityLabel="Live camera stream"
          />
          <View style={styles.snapshotBlackoutOverlay} pointerEvents="none" />
        </>
      ) : null}
      {!isVideoMode && snapshotUri ? (
        <>
          <Image
            source={{ uri: snapshotUri }}
            style={styles.snapshotImage}
            resizeMode="cover"
            accessibilityLabel="Latest camera snapshot"
          />
          <View style={styles.snapshotBlackoutOverlay} pointerEvents="none" />
        </>
      ) : null}
      {isVideoMode && !hasRtspStream ? (
        <View style={styles.statusOverlay} pointerEvents="none">
          <MonoText style={styles.statusText}>
            RTSP URL missing. Set EXPO_PUBLIC_RTSP_STREAM_URL.
          </MonoText>
        </View>
      ) : null}
      {isVideoMode && hasRtspStream && isIosRtspUnsupported ? (
        <View style={styles.statusOverlay} pointerEvents="none">
          <MonoText style={styles.statusText}>
            iOS player does not support this RTSP source directly. Use IMG mode
            or provide an HLS/HTTP stream URL.
          </MonoText>
        </View>
      ) : null}
      {isVideoMode && streamError ? (
        <View style={styles.statusOverlay} pointerEvents="none">
          <MonoText style={styles.statusText}>
            Live stream unavailable. Using snapshot mode is recommended.
          </MonoText>
        </View>
      ) : null}
      <View style={styles.logBlendLayer} pointerEvents="none">
        <LinearGradient
          colors={["rgba(18, 26, 26, 0)", "rgba(16, 64, 55, 0.52)", "rgba(9, 28, 24, 0.72)"]}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={StyleSheet.absoluteFillObject}
          pointerEvents="none"
        />
      </View>
      <View style={styles.logOverlay} pointerEvents="none">
        <ScrollView
          ref={logScrollRef}
          style={styles.logScroll}
          contentContainerStyle={styles.logScrollContent}
          showsVerticalScrollIndicator={false}
          pointerEvents="none"
          onContentSizeChange={() => {
            if (!logScrollRef.current) return;
            logScrollRef.current.scrollToEnd({ animated: true });
          }}
        >
          {lines.map((line, index) => (
            <MonoText key={`${index}-${line}`} style={styles.logLine}>
              {line}
            </MonoText>
          ))}
        </ScrollView>
      </View>
      <View style={styles.toggleWrapper}>
        <Pressable
          style={[styles.trackBackground, styles.trackInnerShadow]}
          onPress={handleTogglePress}
          accessibilityLabel={`Mode toggle, currently ${isOn ? "video" : "snapshot"}`}
          accessibilityRole="switch"
          accessibilityState={{ checked: isOn }}
          accessibilityHint="Double tap to switch between video and snapshot"
        >
          <View
            style={[
              styles.thumbBackground,
              styles.thumbShadow,
              isOn ? { marginTop: "auto" } : { marginBottom: "auto" },
            ]}
          >
            <MonoText style={styles.stateText}>{isOn ? "VID" : "IMG"}</MonoText>
          </View>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 292,
    backgroundColor: "#f2f2f2",
    borderWidth: 1,
    borderColor: "#1a1c29",
    borderRadius: 40,
    overflow: "hidden",
    marginBottom: 10,
  },
  innerShadow: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 40,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 2,
    elevation: 4,
  },
  snapshotImage: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 30,
  },
  snapshotBlackoutOverlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 30,
    backgroundColor: "rgba(0, 0, 0, 0.18)",
  },
  statusOverlay: {
    position: "absolute",
    left: 16,
    right: 16,
    top: 16,
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  statusText: {
    fontSize: 11,
    lineHeight: 15,
    color: "rgba(230, 255, 248, 0.9)",
  },
  toggleWrapper: {
    position: "absolute",
    right: 14,
    bottom: 14,
  },
  logBlendLayer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 120,
  },
  logOverlay: {
    position: "absolute",
    left: 14,
    right: 14,
    bottom: 14,
    height: 53,
  },
  logScroll: {
    flex: 1,
  },
  logScrollContent: {
    paddingHorizontal: 3,
    paddingBottom: 2,
  },
  logLine: {
    fontSize: 8,
    lineHeight: 10,
    color: "rgba(215, 255, 244, 0.86)",
    textShadowColor: "rgba(30, 212, 171, 0.35)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 3,
  },
  trackBackground: {
    width: 69,
    height: 53,
    borderRadius: 20,
    padding: 5,
    backgroundColor: COLORS.skeuo.trackSurface,
  },
  trackInnerShadow: {
    borderWidth: 1,
    borderTopColor: "rgba(0, 0, 0, 0.12)",
    borderLeftColor: "rgba(0, 0, 0, 0.06)",
    borderRightColor: "rgba(0, 0, 0, 0.06)",
    borderBottomColor: "rgba(0, 0, 0, 0.03)",
  },
  thumbBackground: {
    height: 27,
    width: "100%",
    borderRadius: 32,
    backgroundColor: COLORS.skeuo.panelSurface,
  },
  thumbShadow: {
    shadowColor: COLORS.base.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  stateText: {
    fontSize: 9,
    color: COLORS.skeuo.labelText,
    textAlign: "center",
    fontWeight: "600",
    lineHeight: 27,
  },
});
