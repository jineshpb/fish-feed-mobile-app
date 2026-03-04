import { Alert, View } from 'react-native';
import { ActionButton } from './ActionButton';

const handleFeed = () => {
  Alert.alert('Feed', 'Manual feed action pressed.');
};

const handleLights = () => {
  Alert.alert('Lights', 'Lights action pressed.');
};

const handleClick = () => {
  Alert.alert('Camera', 'Camera click action pressed.');
};

export const ActionBar = () => (
  <View className="flex-row w-full gap-4" accessibilityLabel="Feed, lights, and camera actions">
    <ActionButton label="feed" iconKey="feed" onPress={handleFeed} />
    <ActionButton label="lights" iconKey="lights" onPress={handleLights} />
    <ActionButton label="click" iconKey="click" onPress={handleClick} />
  </View>
);
