import { Text } from "react-native";

export const MonoText = ({ style, ...props }) => (
  <Text
    {...props}
    style={[{ fontFamily: "SpaceMono_400Regular" }, style]}
  />
);
