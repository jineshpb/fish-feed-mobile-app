import { StyleSheet, View } from 'react-native';

export const NeumorphicCard = ({ children, className = '', radius = 50, pressed = false }) => (
  <View
    className={className}
    style={[styles.layerOne, { borderRadius: radius }, pressed && styles.clearOuterShadow]}
  >
    <View style={[styles.layerTwo, { borderRadius: radius }, pressed && styles.clearOuterShadow]}>
      <View style={[styles.layerThree, { borderRadius: radius }, pressed && styles.clearOuterShadow]}>
        <View
          style={[
            styles.surface,
            { borderRadius: radius },
            pressed && styles.surfacePressed,
          ]}
        >
          {children}
        </View>
      </View>
    </View>
  </View>
);

const styles = StyleSheet.create({
  layerOne: {
    flex: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.17,
    shadowRadius: 18,
    elevation: 8,
  },
  layerTwo: {
    flex: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.17,
    shadowRadius: 3,
    elevation: 3,
  },
  layerThree: {
    flex: 1,
    shadowColor: '#fff',
    shadowOffset: { width: -2, height: -2 },
    shadowOpacity: 0.9,
    shadowRadius: 4,
  },
  clearOuterShadow: {
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  surface: {
    flex: 1,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#f8f8f8',
    overflow: 'hidden',
  },
  surfacePressed: {
    borderWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.07)',
    borderLeftColor: 'rgba(0, 0, 0, 0.04)',
    borderRightColor: 'rgba(0, 0, 0, 0.04)',
    borderBottomColor: 'rgba(0, 0, 0, 0.02)',
  },
});
