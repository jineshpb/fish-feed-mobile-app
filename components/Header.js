import { Text, View } from 'react-native';

const BLUEFY_HEADER = 'BLUEFY';

export const Header = () => (
  <View
    className="items-center mb-[10px]"
    accessibilityRole="header"
    accessibilityLabel="BLUEFY app title"
  >
    <Text className="text-[16px] tracking-[0.5px] text-[#cbcbcb]">{BLUEFY_HEADER}</Text>
  </View>
);
