import { View, ScrollView, StyleSheet } from "react-native";
import { colors, spacing, radius } from "../theme";
import { SALON_NAME } from "../constants/brand";
import { useTranslation } from "../i18n/LanguageContext";
import Heading from "../components/Heading";
import BodyText from "../components/BodyText";
import Button from "../components/Button";
import Card from "../components/Card";

const SWATCHES = [
  { name: "Noir", value: colors.black },
  { name: "Blanc cassé", value: colors.offWhite },
  { name: "Doré", value: colors.gold },
  { name: "Anthracite", value: colors.anthracite },
];

export default function StyleGuideScreen() {
  const { language, setLanguage, t } = useTranslation();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Heading level={1}>{SALON_NAME}</Heading>
      <BodyText style={{ marginTop: spacing.sm }}>{t("styleGuide.subtitle")}</BodyText>

      <Button
        label={t("styleGuide.languageToggle")}
        variant="secondary"
        onPress={() => setLanguage(language === "fr" ? "en" : "fr")}
        style={{ marginTop: spacing.md, alignSelf: "flex-start" }}
      />

      <Heading level={2} style={styles.sectionTitle}>
        {t("styleGuide.sectionPalette")}
      </Heading>
      <View style={styles.swatchRow}>
        {SWATCHES.map((s) => (
          <View key={s.name} style={styles.swatchItem}>
            <View style={[styles.swatch, { backgroundColor: s.value }]} />
            <BodyText size="small">{s.name}</BodyText>
          </View>
        ))}
      </View>

      <Heading level={2} style={styles.sectionTitle}>
        {t("styleGuide.sectionTypography")}
      </Heading>
      <Heading level={1}>Titre H1 — serif</Heading>
      <Heading level={2}>Titre H2 — serif</Heading>
      <Heading level={3}>Titre H3 — serif</Heading>
      <BodyText style={{ marginTop: spacing.sm }}>{t("styleGuide.bodySample")}</BodyText>

      <Heading level={2} style={styles.sectionTitle}>
        {t("styleGuide.sectionButtons")}
      </Heading>
      <Button label={t("styleGuide.buttonPrimary")} variant="primary" onPress={() => {}} style={{ marginBottom: spacing.sm }} />
      <Button label={t("styleGuide.buttonSecondary")} variant="secondary" onPress={() => {}} />

      <Heading level={2} style={styles.sectionTitle}>
        {t("styleGuide.sectionCards")}
      </Heading>
      <Card variant="light" style={{ marginBottom: spacing.md }}>
        <Heading level={3}>Coupe personnalisée</Heading>
        <BodyText style={{ marginTop: spacing.xs }}>60 min · 5 000 FCFA</BodyText>
      </Card>
      <Card variant="dark">
        <Heading level={3} color={colors.offWhite}>
          Coupe + teinture
        </Heading>
        <BodyText color={colors.offWhite} style={{ marginTop: spacing.xs }}>
          90 min · 10 000 FCFA
        </BodyText>
      </Card>
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
  sectionTitle: {
    marginTop: spacing.xl,
    marginBottom: spacing.md,
  },
  swatchRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.md,
  },
  swatchItem: {
    alignItems: "center",
    width: 80,
  },
  swatch: {
    width: 56,
    height: 56,
    borderRadius: radius.card,
    marginBottom: spacing.xs,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.anthracite,
  },
});
