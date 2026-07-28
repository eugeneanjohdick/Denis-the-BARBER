import { View, StyleSheet } from "react-native";
import { colors, radius, spacing, shadows } from "../theme";

export default function Card({ variant = "light", style, children }) {
  const variantStyle = variant === "dark" ? styles.dark : styles.light;

  return <View style={[styles.base, variantStyle, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.card,
    padding: spacing.lg,
    ...shadows.card,
  },
  light: {
    backgroundColor: colors.offWhite,
  },
  dark: {
    backgroundColor: colors.anthracite,
  },
});
