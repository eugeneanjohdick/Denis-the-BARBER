import { Text, StyleSheet } from "react-native";
import { colors, fontFamily, fontSize } from "../theme";

export default function BodyText({ size = "body", weight = "regular", color = colors.black, style, children, ...props }) {
  const family = weight === "semibold" ? fontFamily.sansSemiBold : weight === "medium" ? fontFamily.sansMedium : fontFamily.sans;

  return (
    <Text style={[{ fontFamily: family, fontSize: fontSize[size], color }, style]} {...props}>
      {children}
    </Text>
  );
}
