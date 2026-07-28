import { View, StyleSheet } from "react-native";
import { colors, spacing } from "../theme";
import { useTranslation } from "../i18n/LanguageContext";
import { useAuth } from "../auth/AuthContext";
import Heading from "../components/Heading";
import BodyText from "../components/BodyText";
import Button from "../components/Button";

export default function ProfileScreen({ navigation }) {
  const { t } = useTranslation();
  const { client, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigation.replace("Home");
  };

  return (
    <View style={styles.container}>
      <Heading level={2} style={styles.title}>
        {t("profile.title")}
      </Heading>
      <BodyText style={styles.phone}>{client?.phone}</BodyText>

      <Button label={t("profile.logout")} variant="secondary" onPress={handleLogout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.offWhite,
    padding: spacing.lg,
    justifyContent: "center",
  },
  title: {
    marginBottom: spacing.md,
  },
  phone: {
    marginBottom: spacing.xl,
  },
});
