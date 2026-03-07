import { useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  View,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { NeumorphicCard } from "./NeumorphicCard";
import { MonoText } from "./MonoText";

const ICON_MAP = {
  feed: "fish-outline",
  lights: "bulb-outline",
  click: "camera-outline",
};

export const ACTION_BUTTON_VARIANT = { push: "push", toggle: "toggle" };

export const ActionButton = ({
  label = "feed",
  iconKey = "feed",
  variant = ACTION_BUTTON_VARIANT.toggle,
  defaultActive = false,
  active,
  forceActive = false,
  surfaceActive,
  ledActive,
  loading = false,
  onActiveChange,
  onPress,
}) => {
  const [internalActive, setInternalActive] = useState(defaultActive);
  const [isPressed, setIsPressed] = useState(false);
  const isPush = variant === ACTION_BUTTON_VARIANT.push;
  const isControlled = typeof active === "boolean";
  const isActive = isPush ? false : isControlled ? active : internalActive;
  const defaultSurfaceActive = forceActive || (isPush ? isPressed : isActive);
  const computedSurfaceActive =
    typeof surfaceActive === "boolean" ? surfaceActive : defaultSurfaceActive;
  const computedLedActive =
    typeof ledActive === "boolean" ? ledActive : computedSurfaceActive;
  const iconName = ICON_MAP[iconKey] ?? ICON_MAP.feed;
  const iconColor = computedSurfaceActive ? "#bdbdbd" : "#d2d2d2";

  const handlePress = async () => {
    if (loading) return;

    if (isPush) {
      await onPress?.();
      return;
    }

    const nextValue = !isActive;

    if (!isControlled) {
      setInternalActive(nextValue);
    }

    onActiveChange?.(nextValue);
    await onPress?.(nextValue);
  };

  return (
    <NeumorphicCard
      className="flex-1 min-w-[100px] h-[274px]"
      radius={40}
      pressed={computedSurfaceActive}
    >
      <Pressable
        className="flex-1 rounded-[96px] px-6 pt-8 pb-5 items-center justify-between"
        style={isPressed ? styles.buttonPressed : undefined}
        onPress={handlePress}
        onPressIn={() => !loading && setIsPressed(true)}
        onPressOut={() => setIsPressed(false)}
        disabled={loading}
        accessibilityLabel={isPush ? `${label} button` : `${label} toggle`}
        accessibilityRole={isPush ? "button" : "switch"}
        accessibilityState={
          isPush
            ? { busy: loading }
            : { checked: computedLedActive, busy: loading }
        }
      >
        <View
          className={`w-[17px] h-[17px] rounded-full ${computedLedActive ? "bg-[#47dd5e]" : "bg-[##353C42]"}`}
          style={[
            styles.dotShadow,
            computedLedActive && styles.dotActiveShadow,
          ]}
        />
        <View className="items-center gap-2">
          {loading ? (
            <ActivityIndicator size="small" color={iconColor} />
          ) : (
            <Ionicons name={iconName} size={24} color={iconColor} />
          )}
          <MonoText className="text-[12px] text-[#d2d2d2]">{label}</MonoText>
        </View>
      </Pressable>
    </NeumorphicCard>
  );
};

const styles = StyleSheet.create({
  buttonPressed: {
    opacity: 0.92,
  },
  dotShadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
  dotActiveShadow: {
    shadowColor: "#47dd5e",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.7,
    shadowRadius: 5,
    elevation: 4,
  },
});
