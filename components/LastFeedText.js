import { StyleSheet, View } from "react-native";
import { MonoText } from "./MonoText";

const DEFAULT_LAST_FEED = "Last feed today 9:00 AM";

export const LastFeedText = ({ text = DEFAULT_LAST_FEED }) => (
  <View
    style={styles.container}
    accessibilityLabel={`Last feed: ${text}`}
    className="mt-4"
  >
    <MonoText style={styles.text}>{text}</MonoText>
  </View>
);

const styles = StyleSheet.create({
  container: {
    marginBottom: 42,
  },
  text: {
    fontSize: 12,
    color: "#717477",
    textTransform: "uppercase",
    textAlign: "center",
  },
});
