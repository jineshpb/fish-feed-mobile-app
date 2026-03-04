import { StyleSheet, View } from 'react-native';

export const VideoFeedPlaceholder = () => (
  <View style={styles.container} accessibilityLabel="Camera feed placeholder">
    <View style={styles.innerShadow} />
  </View>
);

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 292,
    backgroundColor: '#f2f2f2',
    borderWidth: 1,
    borderColor: '#dadada',
    borderRadius: 40,
    overflow: 'hidden',
    marginBottom: 10,
  },
  innerShadow: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 2,
    elevation: 4,
  },
});
