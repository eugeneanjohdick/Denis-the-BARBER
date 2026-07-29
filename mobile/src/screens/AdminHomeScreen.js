import { View, ScrollView, StyleSheet } from "react-native";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import { colors, spacing } from "../theme";
import { useTranslation } from "../i18n/LanguageContext";
import { useAdminAuth } from "../auth/AdminAuthContext";
import Heading from "../components/Heading";
import BodyText from "../components/BodyText";
import Button from "../components/Button";
import Card from "../components/Card";

function StubCard({ title, t }) {
  return (
    <Card variant="light" style={styles.card}>
      <Heading level={3}>{title}</Heading>
      <BodyText style={styles.comingSoon}>{t("admin.comingSoon")}</BodyText>
    </Card>
  );
}

export default function AdminHomeScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { staff, isAdminAuthenticated, isManager, logout } = useAdminAuth();
  const isFocused = useIsFocused();

  const handleLogout = async () => {
    await logout();
    navigation.replace("Home");
  };

  if (!isAdminAuthenticated) {
    return (
      <View style={styles.center}>
        <Heading level={2} style={styles.title}>
          {t("admin.loginRequiredTitle")}
        </Heading>
        <Button label={t("admin.login")} variant="primary" onPress={() => navigation.navigate("AdminLogin")} />
      </View>
    );
  }

  if (!isFocused) {
    return null;
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Heading level={2} style={styles.title}>
        {t("admin.homeTitle")} {staff.full_name}
      </Heading>
      <BodyText style={styles.roleLabel}>{isManager ? t("admin.roleManager") : t("admin.roleStaff")}</BodyText>

      <StubCard title={t("admin.myPlanning")} t={t} />
      {isManager ? (
        <>
          <StubCard title={t("admin.allPlannings")} t={t} />
          <StubCard title={t("admin.stats")} t={t} />
          <StubCard title={t("admin.finances")} t={t} />
        </>
      ) : null}

      <Button label={t("admin.logout")} variant="secondary" onPress={handleLogout} style={styles.logoutButton} />
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
  },
  center: {
    flex: 1,
    backgroundColor: colors.offWhite,
    padding: spacing.lg,
    justifyContent: "center",
  },
  title: {
    marginBottom: spacing.sm,
  },
  roleLabel: {
    marginBottom: spacing.lg,
    color: colors.gold,
  },
  card: {
    marginBottom: spacing.md,
  },
  comingSoon: {
    marginTop: spacing.xs,
    opacity: 0.6,
  },
  logoutButton: {
    marginTop: spacing.md,
  },
});
