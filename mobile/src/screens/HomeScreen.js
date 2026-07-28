import { View, ScrollView, StyleSheet, Linking } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { colors, spacing, radius } from "../theme";
import { SALON_NAME } from "../constants/brand";
import { WHATSAPP_DENIS, WHATSAPP_COLLINS, whatsappUrl } from "../constants/contact";
import { useTranslation } from "../i18n/LanguageContext";
import { useAuth } from "../auth/AuthContext";
import Heading from "../components/Heading";
import BodyText from "../components/BodyText";
import Button from "../components/Button";
import Card from "../components/Card";

export default function HomeScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { isAuthenticated } = useAuth();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.logo}>
        <Heading level={2} color={colors.gold}>
          DB
        </Heading>
      </View>

      <View style={styles.photoPlaceholder}>
        <BodyText color={colors.offWhite} size="small">
          {t("home.photoPlaceholder")}
        </BodyText>
      </View>

      <Heading level={1} style={styles.title}>
        {SALON_NAME}
      </Heading>
      <BodyText style={styles.tagline}>{t("home.tagline")}</BodyText>

      <Button label={t("home.bookNow")} variant="primary" onPress={() => {}} style={styles.bookButton} />

      <Button
        label={t(isAuthenticated ? "home.myAccount" : "home.login")}
        variant="secondary"
        onPress={() => navigation.navigate(isAuthenticated ? "Profile" : "PhoneLogin")}
        style={styles.accountButton}
      />

      <Card variant="light" style={styles.card}>
        <Heading level={3}>{t("home.hoursTitle")}</Heading>
        <BodyText style={styles.cardLine}>{t("home.hoursClosed")}</BodyText>
        <BodyText style={styles.cardLine}>{t("home.hoursOpen")}</BodyText>
      </Card>

      <Card variant="light" style={styles.card}>
        <Heading level={3}>{t("home.addressTitle")}</Heading>
        <BodyText style={styles.cardLine}>{t("home.addressValue")}</BodyText>
      </Card>

      <Heading level={2} style={styles.sectionTitle}>
        {t("home.contactTitle")}
      </Heading>
      <Button
        label={t("home.whatsappDenis")}
        variant="secondary"
        onPress={() => Linking.openURL(whatsappUrl(WHATSAPP_DENIS))}
        style={styles.whatsappButton}
      />
      <Button
        label={t("home.whatsappCollins")}
        variant="secondary"
        onPress={() => Linking.openURL(whatsappUrl(WHATSAPP_COLLINS))}
        style={styles.whatsappButton}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.offWhite,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
    alignItems: "center",
  },
  logo: {
    width: 64,
    height: 64,
    borderRadius: radius.pill,
    backgroundColor: colors.black,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.md,
  },
  photoPlaceholder: {
    width: "100%",
    aspectRatio: 16 / 9,
    borderRadius: radius.card,
    backgroundColor: colors.anthracite,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.lg,
  },
  title: {
    textAlign: "center",
  },
  tagline: {
    textAlign: "center",
    marginTop: spacing.xs,
    marginBottom: spacing.lg,
  },
  bookButton: {
    width: "100%",
    maxWidth: 320,
    marginBottom: spacing.md,
  },
  accountButton: {
    width: "100%",
    maxWidth: 320,
    marginBottom: spacing.xl,
  },
  card: {
    width: "100%",
    marginBottom: spacing.md,
  },
  cardLine: {
    marginTop: spacing.xs,
  },
  sectionTitle: {
    alignSelf: "flex-start",
    marginTop: spacing.md,
    marginBottom: spacing.md,
  },
  whatsappButton: {
    width: "100%",
    maxWidth: 320,
    marginBottom: spacing.sm,
  },
});
