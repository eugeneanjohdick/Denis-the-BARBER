import { TextInput, StyleSheet } from "react-native";
import { colors, fontFamily, fontSize, radius, spacing } from "../theme";

export default function TextField({ value, onChangeText, placeholder, style, ...props }) {
  return (
    <TextInput
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor={colors.anthracite}
      style={[styles.input, style]}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1.5,
    borderColor: colors.anthracite,
    borderRadius: radius.input,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    fontFamily: fontFamily.sans,
    fontSize: fontSize.body,
    color: colors.black,
    backgroundColor: colors.offWhite,
  },
});
