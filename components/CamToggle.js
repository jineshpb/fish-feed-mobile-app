import { useState } from "react";
import { StyleSheet, View, Pressable } from "react-native";
import { COLORS } from "../theme/colors";
import { MonoText } from "./MonoText";

const LABEL = "Cam toggle";

export const CamToggle = ({
  label = LABEL,
  defaultValue = false,
  value,
  onValueChange,
}) => {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const isControlled = typeof value === "boolean";
  const isOn = isControlled ? value : internalValue;

  const handlePress = () => {
    const nextValue = !isOn;

    if (!isControlled) {
      setInternalValue(nextValue);
    }

    if (onValueChange) {
      onValueChange(nextValue);
    }
  };

  return (
    <View
      className="flex-row items-center justify-between w-full rounded-3xl mt-4"
      style={[styles.containerSurface, styles.containerHighlight]}
      accessibilityLabel={`${label}, ${isOn ? "on" : "off"}`}
    >
      <View
        className="flex-row items-center justify-between w-full py-2 pl-6 pr-2 rounded-3xl"
        style={[styles.containerSurface, styles.containerShadow]}
      >
        <MonoText className="text-[12px] uppercase" style={styles.labelText}>
          {label}
        </MonoText>
        <Pressable
          className="w-[69px] h-[53px] rounded-[20px] p-[5px] flex flex-col"
          style={[styles.trackBackground, styles.trackInnerShadow]}
          onPress={handlePress}
          accessibilityLabel={`Toggle camera, currently ${isOn ? "on" : "off"}`}
          accessibilityRole="switch"
          accessibilityState={{ checked: isOn }}
          accessibilityHint="Double tap to switch camera mode"
        >
          <View
            className="h-[27px] w-full rounded-[32px]"
            style={[
              styles.thumbBackground,
              styles.thumbShadow,
              isOn ? { marginTop: "auto" } : { marginBottom: "auto" },
            ]}
          >
            <MonoText style={styles.stateText}>{isOn ? "ON" : "OFF"}</MonoText>
          </View>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  containerSurface: {
    backgroundColor: COLORS.skeuo.panelSurface,
  },
  labelText: {
    color: COLORS.skeuo.labelText,
  },
  containerShadow: {
    shadowColor: COLORS.base.black,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.45,
    shadowRadius: 8,
    elevation: 4,
  },
  containerHighlight: {
    shadowColor: COLORS.base.white,
    shadowOffset: { width: -2, height: -3 },
    shadowOpacity: 0.125,
    shadowRadius: 4,
    elevation: 4,
  },
  trackBackground: {
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
