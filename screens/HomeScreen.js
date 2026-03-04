import { StyleSheet, View, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Header,
  VideoFeedPlaceholder,
  CamToggle,
  LastFeedText,
  ActionBar,
} from '../components';

export const HomeScreen = () => {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: insets.top,
            paddingBottom: insets.bottom,
          },
        ]}
        showsVerticalScrollIndicator={false}
        accessibilityLabel="BLUEFY home screen"
      >
        <View style={styles.content}>
          <Header />
          <VideoFeedPlaceholder />
          <CamToggle />
          <LastFeedText />
          <ActionBar />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#efefef',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 15,
    alignItems: 'center',
  },
  content: {
    width: '100%',
    maxWidth: 356,
    alignItems: 'center',
  },
});
