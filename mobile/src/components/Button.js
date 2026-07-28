import { Pressable, StyleSheet } from "react-native";
import { colors, fontFamily, fontSize, radius, spacing, shadows } from "../theme";
import BodyText from "./BodyText";

export default function Button({ label, onPress, variant = "primary", style, disabled }) {
  const variantStyle = variant === "primary" ? styles.primary : styles.secondary;
  const textColor = variant === "primary" ? colors.black : colors.gold;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.base,
        variantStyle,
        disabled && styles.disabled,
        pressed && !disabled && styles.pressed,
        style,
      ]}
    >
      <BodyText weight="semibold" color={textColor} style={{ fontFamily: fontFamily.sansSemiBold, fontSize: fontSize.body }}>
        {label}
      </BodyText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.button,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    alignItems: "center",
    justifyContent: "center",
  },
  primary: {
    backgroundColor: colors.gold,
    ...shadows.button,
  },
  secondary: {
    backgroundColor: "transparent",
    borderWidth: 1.5,
    borderColor: colors.gold,
  },
  disabled: {
    opacity: 0.4,
  },
  pressed: {
    opacity: 0.85,
  },
});
