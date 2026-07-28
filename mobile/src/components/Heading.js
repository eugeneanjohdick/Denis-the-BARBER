import { Text, StyleSheet } from "react-native";
import { colors, fontFamily, fontSize } from "../theme";

export default function Heading({ level = 1, color = colors.black, style, children, ...props }) {
  const levelStyle = level === 1 ? styles.h1 : level === 2 ? styles.h2 : styles.h3;

  return (
    <Text style={[levelStyle, { color }, style]} {...props}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  h1: {
    fontFamily: fontFamily.serifBold,
    fontSize: fontSize.h1,
  },
  h2: {
    fontFamily: fontFamily.serifBold,
    fontSize: fontSize.h2,
  },
  h3: {
    fontFamily: fontFamily.serifRegular,
    fontSize: fontSize.h3,
  },
});
