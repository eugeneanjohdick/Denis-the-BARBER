import { useCallback, useState } from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import { useNavigation, useIsFocused, useFocusEffect } from "@react-navigation/native";
import { colors, spacing } from "../theme";
import { useTranslation } from "../i18n/LanguageContext";
import { useAuth } from "../auth/AuthContext";
import { getServices, getCoiffeurs, getAppointments, cancelAppointment, ApiError } from "../services/api";
import { formatDate, formatPrice, isoToLocalDateTime } from "../utils/format";
import Heading from "../components/Heading";
import BodyText from "../components/BodyText";
import Button from "../components/Button";
import Card from "../components/Card";

export default function HistoryScreen() {
  const { language, t } = useTranslation();
  const navigation = useNavigation();
  const { isAuthenticated, token } = useAuth();
  const isFocused = useIsFocused();

  const [appointments, setAppointments] = useState([]);
  const [services, setServices] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [confirmingId, setConfirmingId] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);
  const [cancelError, setCancelError] = useState(null);

  const load = useCallback(() => {
    if (!isAuthenticated) return;
    setLoading(true);
    setError(null);
    Promise.all([getServices(), getCoiffeurs(), getAppointments({ token })])
      .then(([servicesList, coiffeursList, { appointments: list }]) => {
        setServices(servicesList);
        setStaffList(coiffeursList);
        setAppointments(list);
      })
      .catch((err) => setError(err instanceof ApiError ? err.message : t("history.loadError")))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, token]);

  useFocusEffect(load);

  const handleConfirmCancel = async (appointmentId) => {
    setCancelError(null);
    setCancellingId(appointmentId);
    try {
      const { appointment } = await cancelAppointment({ appointmentId, token });
      setAppointments((prev) =>
        prev.map((a) =>
          a.id === appointment.id
            ? { ...a, status: appointment.status, cancelled_at: appointment.cancelled_at, cancelled_by: appointment.cancelled_by }
            : a
        )
      );
    } catch (err) {
      setCancelError(err instanceof ApiError ? err.message : t("history.cancelError"));
    } finally {
      setCancellingId(null);
      setConfirmingId(null);
    }
  };

  if (!isAuthenticated) {
    return (
      <View style={styles.center}>
        <Heading level={2} style={styles.title}>
          {t("slot.loginRequiredTitle")}
        </Heading>
        <Button label={t("home.login")} variant="primary" onPress={() => navigation.navigate("PhoneLogin")} />
      </View>
    );
  }

  if (!isFocused) {
    return null;
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Heading level={2} style={styles.title}>
        {t("history.title")}
      </Heading>

      {loading ? <BodyText style={styles.status}>{t("history.loading")}</BodyText> : null}
      {error ? (
        <BodyText weight="semibold" style={styles.error}>
          {error}
        </BodyText>
      ) : null}
      {!loading && !error && appointments.length === 0 ? (
        <BodyText style={styles.status}>{t("history.empty")}</BodyText>
      ) : null}
      {cancelError ? (
        <BodyText weight="semibold" style={styles.error}>
          {cancelError}
        </BodyText>
      ) : null}

      {appointments.map((appointment) => {
        const service = services.find((s) => s.id === appointment.service);
        const staff = staffList.find((s) => s.id === appointment.staff);
        const { date, time } = isoToLocalDateTime(appointment.start_datetime);
        const confirmed = appointment.status === "Confirmé";

        return (
          <Card key={appointment.id} variant="light" style={styles.card}>
            <BodyText weight="semibold" style={styles.line}>
              {service ? (language === "en" ? service.name_en : service.name_fr) : ""}
            </BodyText>
            <BodyText style={styles.line}>{staff?.full_name}</BodyText>
            <BodyText style={styles.line}>
              {formatDate(date, language)} · {time}
            </BodyText>
            <BodyText style={styles.line}>{formatPrice(appointment.price_charged_fcfa)}</BodyText>
            <BodyText
              weight="semibold"
              style={[styles.line, confirmed ? styles.statusConfirmed : styles.statusCancelled]}
            >
              {confirmed ? t("history.statusConfirmed") : t("history.statusCancelled")}
            </BodyText>

            {confirmed && confirmingId === appointment.id ? (
              <View style={styles.confirmRow}>
                <BodyText weight="semibold" style={styles.line}>
                  {t("history.cancelConfirmBody")}
                </BodyText>
                <View style={styles.confirmButtons}>
                  <Button
                    label={t("history.cancelConfirmNo")}
                    variant="secondary"
                    onPress={() => setConfirmingId(null)}
                    disabled={cancellingId === appointment.id}
                    style={styles.confirmButton}
                  />
                  <Button
                    label={cancellingId === appointment.id ? t("history.cancelling") : t("history.cancelConfirmYes")}
                    variant="primary"
                    onPress={() => handleConfirmCancel(appointment.id)}
                    disabled={cancellingId === appointment.id}
                    style={styles.confirmButton}
                  />
                </View>
              </View>
            ) : null}

            {confirmed && confirmingId !== appointment.id ? (
              <Button
                label={t("history.cancel")}
                variant="secondary"
                onPress={() => setConfirmingId(appointment.id)}
                style={styles.cancelButton}
              />
            ) : null}
          </Card>
        );
      })}
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
    marginBottom: spacing.lg,
  },
  status: {
    marginBottom: spacing.md,
  },
  error: {
    marginBottom: spacing.md,
  },
  card: {
    marginBottom: spacing.md,
  },
  line: {
    marginBottom: spacing.xs,
  },
  statusConfirmed: {
    color: colors.gold,
  },
  statusCancelled: {
    opacity: 0.6,
  },
  cancelButton: {
    marginTop: spacing.sm,
  },
  confirmRow: {
    marginTop: spacing.sm,
  },
  confirmButtons: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  confirmButton: {
    flex: 1,
  },
});
