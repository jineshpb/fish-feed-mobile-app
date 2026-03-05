import { useState } from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';

const LABEL = 'Cam toggle';

export const CamToggle = ({
  label = LABEL,
  defaultValue = false,
  value,
  onValueChange,
}) => {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const isControlled = typeof value === 'boolean';
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
      className="flex-row items-center justify-between bg-white w-full py-2 pl-4 pr-2 rounded-3xl mb-[10px]"
      style={styles.containerShadow}
      accessibilityLabel={`${label}, ${isOn ? 'on' : 'off'}`}
    >
      <Text className="text-[12px] text-[#bebebe] uppercase">{label}</Text>
      <Pressable
        className={`w-[69px] h-[53px] rounded-[20px] p-[5px] flex flex-col ${
          isOn ? 'bg-[#e7f6ec]' : 'bg-[#f1f1f1]'
        }`}
        style={styles.trackInnerShadow}
        onPress={handlePress}
        accessibilityLabel={`Toggle camera, currently ${isOn ? 'on' : 'off'}`}
        accessibilityRole="switch"
        accessibilityState={{ checked: isOn }}
        accessibilityHint="Double tap to switch camera mode"
      >
        <View
          className="h-[27px] w-full bg-white rounded-[32px]"
          style={[
            styles.thumbShadow,
            isOn ? { marginTop: 'auto' } : { marginBottom: 'auto' },
          ]}
        >
          <Text style={styles.stateText}>{isOn ? 'ON' : 'OFF'}</Text>
        </View>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  containerShadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.09,
    shadowRadius: 4,
    elevation: 4,
  },
  trackInnerShadow: {
    borderWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.12)',
    borderLeftColor: 'rgba(0, 0, 0, 0.06)',
    borderRightColor: 'rgba(0, 0, 0, 0.06)',
    borderBottomColor: 'rgba(0, 0, 0, 0.03)',
  },
  thumbShadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  stateText: {
    fontSize: 9,
    color: '#a9a9a9',
    textAlign: 'center',
    fontWeight: '600',
    lineHeight: 27,
  },
});
