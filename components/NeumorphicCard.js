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
          {pressed && (
            <>
              <View
                pointerEvents="none"
                style={[styles.insetTopShade, { borderTopLeftRadius: radius, borderTopRightRadius: radius }]}
              />
              <View
                pointerEvents="none"
                style={[styles.insetBottomLine, { borderBottomLeftRadius: radius, borderBottomRightRadius: radius }]}
              />
            </>
          )}
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
    borderColor: '#e2e2e2',
  },
  insetTopShade: {
    position: 'absolute',
    top: 0,
    left: 1,
    right: 1,
    height: 14,
    backgroundColor: 'rgba(0,0,0,0.1)',
    filter: 'blur(10px)',

  },
  insetBottomLine: {
    position: 'absolute',
    left: 1,
    right: 1,
    bottom: 0,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.8)',
  },
});
