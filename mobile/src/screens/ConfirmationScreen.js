import { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { useNavigation, useRoute, useIsFocused } from "@react-navigation/native";
import { colors, spacing } from "../theme";
import { useTranslation } from "../i18n/LanguageContext";
import { useAuth } from "../auth/AuthContext";
import { getServices, getCoiffeurs, apiFetch, ApiError } from "../services/api";
import { formatDate, formatPrice } from "../utils/format";
import Heading from "../components/Heading";
import BodyText from "../components/BodyText";
import Button from "../components/Button";
import Card from "../components/Card";

export default function ConfirmationScreen() {
  const { language, t } = useTranslation();
  const navigation = useNavigation();
  const { params } = useRoute();
  const { serviceId, staffId, date, start, end } = params;
  const { isAuthenticated, token } = useAuth();
  const isFocused = useIsFocused();

  const [service, setService] = useState(null);
  const [staff, setStaff] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || !isFocused) return;
    Promise.all([getServices(), getCoiffeurs()])
      .then(([services, staffList]) => {
        setService(services.find((s) => s.id === serviceId) ?? null);
        setStaff(staffList.find((s) => s.id === staffId) ?? null);
      })
      .catch((err) => setError(err instanceof ApiError ? err.message : t("confirmation.loadError")))
      .finally(() => setLoading(false));
  }, [isAuthenticated, isFocused]);

  const handleConfirm = async () => {
    setError(null);
    setSubmitting(true);
    try {
      await apiFetch("/appointments", {
        method: "POST",
        body: { staff: staffId, service: serviceId, date, start },
        token,
      });
      setSuccess(true);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : t("confirmation.loadError"));
    } finally {
      setSubmitting(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <View style={styles.center}>
        <Heading level={2} style={styles.title}>
          {t("slot.loginRequiredTitle")}
        </Heading>
        <BodyText style={styles.description}>{t("slot.loginRequiredBody")}</BodyText>
        <Button label={t("home.login")} variant="primary" onPress={() => navigation.navigate("PhoneLogin")} />
      </View>
    );
  }

  if (!isFocused) {
    return null;
  }

  if (success) {
    return (
      <View style={styles.center}>
        <Heading level={2} style={styles.title}>
          {t("confirmation.successTitle")}
        </Heading>
        <BodyText style={styles.description}>{t("confirmation.successBody")}</BodyText>
        <Button label={t("confirmation.backHome")} variant="primary" onPress={() => navigation.navigate("Home")} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Heading level={2} style={styles.title}>
        {t("confirmation.title")}
      </Heading>

      {loading ? <BodyText style={styles.status}>{t("confirmation.loading")}</BodyText> : null}

      {!loading && service && staff ? (
        <Card variant="light" style={styles.card}>
          <BodyText weight="semibold" style={styles.line}>
            {language === "en" ? service.name_en : service.name_fr}
          </BodyText>
          <BodyText style={styles.line}>
            {service.duration_minutes} min · {formatPrice(service.price_fcfa)}
          </BodyText>
          <BodyText style={styles.line}>{staff.full_name}</BodyText>
          <BodyText weight="semibold" style={styles.line}>
            {formatDate(date, language)} · {start} - {end}
          </BodyText>
        </Card>
      ) : null}

      {error ? (
        <BodyText weight="semibold" style={styles.error}>
          {error}
        </BodyText>
      ) : null}

      <Button
        label={submitting ? t("confirmation.confirming") : t("confirmation.confirm")}
        variant="primary"
        onPress={handleConfirm}
        disabled={loading || !service || !staff || submitting}
        style={styles.confirmButton}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.offWhite,
    padding: spacing.lg,
  },
  center: {
    flex: 1,
    backgroundColor: colors.offWhite,
    padding: spacing.lg,
    justifyContent: "center",
  },
  title: {
    marginBottom: spacing.lg,
  },
  description: {
    marginBottom: spacing.lg,
  },
  status: {
    marginBottom: spacing.md,
  },
  card: {
    marginBottom: spacing.lg,
  },
  line: {
    marginBottom: spacing.xs,
  },
  error: {
    marginBottom: spacing.md,
  },
  confirmButton: {
    marginTop: spacing.md,
  },
});
