import { StyleSheet, Text, View } from 'react-native';

const DEFAULT_LAST_FEED = 'Last feed today 9:00 AM';

export const LastFeedText = ({ text = DEFAULT_LAST_FEED }) => (
  <View style={styles.container} accessibilityLabel={`Last feed: ${text}`}>
    <Text style={styles.text}>{text}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    marginBottom: 42,
  },
  text: {
    fontFamily: 'System',
    fontSize: 12,
    color: '#bebebe',
    textTransform: 'uppercase',
    textAlign: 'center',
  },
});
