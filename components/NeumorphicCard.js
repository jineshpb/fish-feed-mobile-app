import { StyleSheet, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS } from "../theme/colors";

const BORDER_WIDTH = 2;
const INNER_SHADOW_SIZE = 16;

export const NeumorphicCard = ({
  children,
  className = "",
  radius = 30,
  pressed = false,
}) => (
  <View
    className={className}
    style={[
      styles.topLayerShadow,
      { borderRadius: radius },
      pressed && styles.clearOuterShadow,
    ]}
  >
    <View
      style={[
        styles.topLayerHighlight,
        { borderRadius: radius },
        pressed && styles.clearOuterShadow,
      ]}
    >
      <View
        style={[
          styles.container,
          { borderRadius: radius },
          pressed && styles.surfacePressed,
        ]}
      >
        <LinearGradient
          opacity={0.6}
          colors={
            pressed
              ? [
                  COLORS.skeuo.cardBorderPressed1,
                  COLORS.skeuo.cardBorderPressed2,
                ]
              : [COLORS.skeuo.cardBorder1, COLORS.skeuo.cardBorder1]
          }
          start={{ x: 0, y: 0.2 }}
          end={{ x: 1, y: 0.8 }}
          style={[styles.gradientBorder, { borderRadius: radius }]}
        >
          <View
            style={[
              styles.containerInner,
              { borderRadius: Math.max(radius - BORDER_WIDTH, 0) },
            ]}
          >
            <LinearGradient
              colors={
                pressed
                  ? [
                      COLORS.skeuo.cardBorderPressed2,
                      COLORS.skeuo.cardBorderPressed1,
                    ]
                  : [COLORS.skeuo.cardBorder1, COLORS.skeuo.cardBorder2]
              }
              start={{ x: 0, y: 0.2 }}
              end={{ x: 1, y: 0.8 }}
              style={StyleSheet.absoluteFillObject}
              pointerEvents="none"
            />
            {pressed && (
              <View
                style={[styles.insetMask, { borderRadius: radius }]}
                pointerEvents="none"
              >
                <LinearGradient
                  colors={[
                    "rgba(0, 0, 0, 0.32)",
                    "rgba(0, 0, 0, 0.14)",
                    "rgba(0, 0, 0, 0)",
                  ]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 0, y: 1 }}
                  style={[styles.insetEdgeTop, { borderRadius: radius }]}
                  pointerEvents="none"
                />
                <LinearGradient
                  colors={[
                    "rgba(0, 0, 0, 0.24)",
                    "rgba(0, 0, 0, 0.1)",
                    "rgba(0, 0, 0, 0)",
                  ]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.insetEdgeLeft}
                  pointerEvents="none"
                />
              </View>
            )}
            {children}
          </View>
        </LinearGradient>
      </View>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradientBorder: {
    flex: 1,
    padding: BORDER_WIDTH,
  },
  insetMask: {
    ...StyleSheet.absoluteFillObject,
    overflow: "hidden",
  },
  insetEdgeTop: {
    position: "absolute",
    borderRadius: 30,
    top: 0,
    left: 0,
    right: 0,
    height: INNER_SHADOW_SIZE,
  },
  insetEdgeLeft: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    width: INNER_SHADOW_SIZE,
  },

  containerInner: {
    flex: 1,
    backgroundColor: COLORS.skeuo.panelSurface,
    overflow: "hidden",
  },
  topLayerHighlight: {
    flex: 1,
    shadowColor: "#fff",
    shadowOffset: { width: -2, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 8,
  },
  topLayerShadow: {
    flex: 1,
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.45,
    shadowRadius: 4,
    elevation: 8,
  },

  clearOuterShadow: {
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },

  surfacePressed: {
    opacity: 0.98,
  },
});
