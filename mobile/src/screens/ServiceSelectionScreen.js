import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Image, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { colors, spacing, radius } from "../theme";
import { useTranslation } from "../i18n/LanguageContext";
import { getServices, ApiError } from "../services/api";
import { formatPrice } from "../utils/format";
import Heading from "../components/Heading";
import BodyText from "../components/BodyText";
import Button from "../components/Button";
import Card from "../components/Card";

export default function ServiceSelectionScreen() {
  const { language, t } = useTranslation();
  const navigation = useNavigation();
  const [services, setServices] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getServices()
      .then(setServices)
      .catch((err) => setError(err instanceof ApiError ? err.message : t("service.loadError")))
      .finally(() => setLoading(false));
  }, []);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Heading level={2} style={styles.title}>
        {t("service.title")}
      </Heading>

      {loading ? <BodyText>{t("service.loading")}</BodyText> : null}
      {error ? (
        <BodyText weight="semibold" style={styles.error}>
          {error}
        </BodyText>
      ) : null}

      {services.map((service) => {
        const selected = service.id === selectedId;
        return (
          <Pressable key={service.id} onPress={() => setSelectedId(service.id)}>
            <Card variant="light" style={[styles.card, selected && styles.cardSelected]}>
              {service.photo_url ? <Image source={{ uri: service.photo_url }} style={styles.photo} /> : null}
              <Heading level={3}>{language === "en" ? service.name_en : service.name_fr}</Heading>
              <BodyText style={styles.description}>
                {language === "en" ? service.description_en : service.description_fr}
              </BodyText>
              <BodyText weight="semibold" style={styles.meta}>
                {service.duration_minutes} min · {formatPrice(service.price_fcfa)}
              </BodyText>
            </Card>
          </Pressable>
        );
      })}

      <Button
        label={t("service.continue")}
        variant="primary"
        onPress={() => navigation.navigate("StaffSelection", { serviceId: selectedId })}
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
    marginBottom: spacing.sm,
  },
  meta: {},
  continueButton: {
    marginTop: spacing.lg,
  },
});
