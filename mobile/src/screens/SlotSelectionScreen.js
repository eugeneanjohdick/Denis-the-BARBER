import { useEffect, useMemo, useState } from "react";
import { View, ScrollView, StyleSheet, Pressable } from "react-native";
import { useNavigation, useRoute, useIsFocused } from "@react-navigation/native";
import { colors, spacing, radius } from "../theme";
import { useTranslation } from "../i18n/LanguageContext";
import { useAuth } from "../auth/AuthContext";
import { getAvailability, ApiError } from "../services/api";
import Heading from "../components/Heading";
import BodyText from "../components/BodyText";
import Button from "../components/Button";

const DAY_ABBR = {
  fr: ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"],
  en: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
};

function toDateString(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function buildUpcomingDays(count) {
  const days = [];
  const today = new Date();
  for (let i = 0; days.length < count; i++) {
    const date = new Date(today.getFullYear(), today.getMonth(), today.getDate() + i);
    if (date.getDay() === 1) continue; // ferme le lundi
    days.push(date);
  }
  return days;
}

export default function SlotSelectionScreen() {
  const { language, t } = useTranslation();
  const navigation = useNavigation();
  const { params } = useRoute();
  const { serviceId, staffId } = params;
  const { isAuthenticated, token } = useAuth();
  const isFocused = useIsFocused();

  const days = useMemo(() => buildUpcomingDays(14), []);
  const [selectedDate, setSelectedDate] = useState(days[0]);
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isAuthenticated || !isFocused) return;
    setSelectedSlot(null);
    setLoading(true);
    setError(null);
    getAvailability({ staffId, serviceId, date: toDateString(selectedDate), token })
      .then((data) => setSlots(data.slots))
      .catch((err) => setError(err instanceof ApiError ? err.message : t("slot.loadError")))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate, isAuthenticated, isFocused]);

  if (!isAuthenticated) {
    return (
      <View style={styles.authGate}>
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

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Heading level={2} style={styles.title}>
        {t("slot.title")}
      </Heading>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dayRow}>
        {days.map((date) => {
          const dateStr = toDateString(date);
          const selected = dateStr === toDateString(selectedDate);
          return (
            <Pressable
              key={dateStr}
              onPress={() => setSelectedDate(date)}
              style={[styles.dayChip, selected && styles.chipSelected]}
            >
              <BodyText size="small" weight="semibold" color={selected ? colors.black : colors.offWhite}>
                {DAY_ABBR[language][date.getDay()]}
              </BodyText>
              <BodyText weight="semibold" color={selected ? colors.black : colors.offWhite}>
                {date.getDate()}
              </BodyText>
            </Pressable>
          );
        })}
      </ScrollView>

      {loading ? <BodyText style={styles.status}>{t("slot.loading")}</BodyText> : null}
      {error ? (
        <BodyText weight="semibold" style={styles.error}>
          {error}
        </BodyText>
      ) : null}
      {!loading && !error && slots.length === 0 ? <BodyText style={styles.status}>{t("slot.none")}</BodyText> : null}

      <View style={styles.slotGrid}>
        {slots.map((slot) => {
          const selected = selectedSlot?.start === slot.start;
          return (
            <Pressable
              key={slot.start}
              onPress={() => setSelectedSlot(slot)}
              style={[styles.slotChip, selected && styles.chipSelected]}
            >
              <BodyText weight="semibold" color={selected ? colors.black : colors.offWhite}>
                {slot.start}
              </BodyText>
            </Pressable>
          );
        })}
      </View>

      <Button
        label={t("slot.continue")}
        variant="primary"
        onPress={() =>
          navigation.navigate("Confirmation", {
            serviceId,
            staffId,
            date: toDateString(selectedDate),
            start: selectedSlot.start,
            end: selectedSlot.end,
          })
        }
        disabled={!selectedSlot}
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
  authGate: {
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
  dayRow: {
    marginBottom: spacing.lg,
  },
  dayChip: {
    backgroundColor: colors.anthracite,
    borderRadius: radius.pill,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    marginRight: spacing.sm,
    alignItems: "center",
    minWidth: 56,
  },
  chipSelected: {
    backgroundColor: colors.gold,
  },
  status: {
    marginBottom: spacing.md,
  },
  error: {
    marginBottom: spacing.md,
  },
  slotGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  slotChip: {
    backgroundColor: colors.anthracite,
    borderRadius: radius.pill,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  continueButton: {
    marginTop: spacing.md,
  },
});
