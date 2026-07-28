import { View, StyleSheet } from "react-native";
import { colors, spacing } from "../theme";
import { SALON_NAME } from "../constants/brand";
import { useTranslation } from "../i18n/LanguageContext";
import Heading from "../components/Heading";
import BodyText from "../components/BodyText";
import Button from "../components/Button";

export default function LanguageSelectionScreen() {
  const { setLanguage } = useTranslation();

  return (
    <View style={styles.container}>
      <Heading level={1} color={colors.offWhite} style={styles.title}>
        {SALON_NAME}
      </Heading>
      <BodyText color={colors.offWhite} style={styles.subtitle}>
        Choisissez votre langue / Choose your language
      </BodyText>

      <View style={styles.buttons}>
        <Button label="Français" variant="primary" onPress={() => setLanguage("fr")} style={styles.button} />
        <Button label="English" variant="primary" onPress={() => setLanguage("en")} style={styles.button} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.xl,
  },
  title: {
    textAlign: "center",
    marginBottom: spacing.sm,
  },
  subtitle: {
    textAlign: "center",
    marginBottom: spacing.xl,
  },
  buttons: {
    width: "100%",
    maxWidth: 320,
  },
  button: {
    marginBottom: spacing.md,
  },
});
