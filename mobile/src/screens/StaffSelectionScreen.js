import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Image, Pressable } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { colors, spacing, radius } from "../theme";
import { useTranslation } from "../i18n/LanguageContext";
import { getCoiffeurs, ApiError } from "../services/api";
import Heading from "../components/Heading";
import BodyText from "../components/BodyText";
import Button from "../components/Button";
import Card from "../components/Card";

export default function StaffSelectionScreen() {
  const { language, t } = useTranslation();
  const navigation = useNavigation();
  const { params } = useRoute();
  const [staff, setStaff] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getCoiffeurs()
      .then(setStaff)
      .catch((err) => setError(err instanceof ApiError ? err.message : t("staff.loadError")))
      .finally(() => setLoading(false));
  }, []);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Heading level={2} style={styles.title}>
        {t("staff.title")}
      </Heading>

      {loading ? <BodyText>{t("staff.loading")}</BodyText> : null}
      {error ? (
        <BodyText weight="semibold" style={styles.error}>
          {error}
        </BodyText>
      ) : null}

      {staff.map((member) => {
        const selected = member.id === selectedId;
        return (
          <Pressable key={member.id} onPress={() => setSelectedId(member.id)}>
            <Card variant="light" style={[styles.card, selected && styles.cardSelected]}>
              {member.photo_url ? <Image source={{ uri: member.photo_url }} style={styles.photo} /> : null}
              <Heading level={3}>{member.full_name}</Heading>
              <BodyText style={styles.description}>
                {language === "en" ? member.specialty_en : member.specialty_fr}
              </BodyText>
            </Card>
          </Pressable>
        );
      })}

      <Button
        label={t("staff.continue")}
        variant="primary"
        onPress={() => navigation.navigate("SlotSelection", { serviceId: params.serviceId, staffId: selectedId })}
        disabled={!selectedId}
        style={styles.continueButton}
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
  },
  title: {
    marginBottom: spacing.lg,
  },
  error: {
    marginBottom: spacing.md,
  },
  card: {
    marginBottom: spacing.md,
  },
  cardSelected: {
    borderWidth: 2,
    borderColor: colors.gold,
  },
  photo: {
    width: "100%",
    aspectRatio: 16 / 9,
    borderRadius: radius.input,
    marginBottom: spacing.sm,
  },
  description: {
    marginTop: spacing.xs,
  },
  continueButton: {
    marginTop: spacing.lg,
  },
});
