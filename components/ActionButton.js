import { useState } from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NeumorphicCard } from './NeumorphicCard';

const ICON_MAP = {
  feed: 'fish-outline',
  lights: 'bulb-outline',
  click: 'camera-outline',
};

export const ActionButton = ({
  label = 'feed',
  iconKey = 'feed',
  defaultActive = false,
  active,
  onActiveChange,
  onPress,
}) => {
  const [internalActive, setInternalActive] = useState(defaultActive);
  const [isPressed, setIsPressed] = useState(false);
  const isControlled = typeof active === 'boolean';
  const isActive = isControlled ? active : internalActive;
  const iconName = ICON_MAP[iconKey] ?? ICON_MAP.feed;
  const iconColor = isActive ? '#bdbdbd' : '#d2d2d2';

  const handlePress = () => {
    const nextValue = !isActive;

    if (!isControlled) {
      setInternalActive(nextValue);
    }

    if (onActiveChange) {
      onActiveChange(nextValue);
    }

    if (onPress) {
      onPress(nextValue);
    }
  };

  return (
    <NeumorphicCard className="flex-1 min-w-[100px] h-[274px]" radius={96} pressed={isActive}>
      <Pressable
        className="flex-1 rounded-[96px] px-6 pt-8 pb-5 items-center justify-between"
        style={isPressed ? styles.buttonPressed : undefined}
        onPress={handlePress}
        onPressIn={() => setIsPressed(true)}
        onPressOut={() => setIsPressed(false)}
        accessibilityLabel={`${label} toggle`}
        accessibilityRole="switch"
        accessibilityState={{ checked: isActive }}
      >
        <View
          className={`w-[17px] h-[17px] rounded-full ${isActive ? 'bg-[#47dd5e]' : 'bg-[#cecece]'}`}
          style={[styles.dotShadow, isActive && styles.dotActiveShadow]}
        />
        <View className="items-center gap-2">
          <Ionicons name={iconName} size={24} color={iconColor} />
          <Text className="text-[12px] text-[#d2d2d2]">{label}</Text>
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
  dotActiveShadow: {
    shadowColor: '#47dd5e',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.7,
    shadowRadius: 5,
    elevation: 4,
  },
});
