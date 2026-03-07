import { View } from 'react-native';
import { MonoText } from './MonoText';

const BLUEFY_HEADER = 'BLUEFY';

export const Header = () => (
  <View
    className="items-center mb-[10px]"
    accessibilityRole="header"
    accessibilityLabel="BLUEFY app title"
  >
    <MonoText className="text-[16px] tracking-[0.5px] text-[#cbcbcb]">{BLUEFY_HEADER}</MonoText>
  </View>
);
