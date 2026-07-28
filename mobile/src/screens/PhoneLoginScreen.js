import { useState } from "react";
import { View, StyleSheet } from "react-native";
import { colors, spacing } from "../theme";
import { useTranslation } from "../i18n/LanguageContext";
import { apiFetch, ApiError } from "../services/api";
import Heading from "../components/Heading";
import BodyText from "../components/BodyText";
import TextField from "../components/TextField";
import Button from "../components/Button";

export default function PhoneLoginScreen({ navigation }) {
  const { t } = useTranslation();
  const [phone, setPhone] = useState("+237");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError(null);
    setLoading(true);
    try {
      await apiFetch("/auth/otp/request", { method: "POST", body: { phone } });
      navigation.navigate("OtpVerify", { phone });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : t("auth.genericError"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Heading level={2} style={styles.title}>
        {t("auth.phoneTitle")}
      </Heading>
      <BodyText style={styles.subtitle}>{t("auth.phoneSubtitle")}</BodyText>

      <TextField
        value={phone}
        onChangeText={setPhone}
        placeholder={t("auth.phonePlaceholder")}
        keyboardType="phone-pad"
        style={styles.field}
      />

      {error ? (
        <BodyText weight="semibold" style={styles.error}>
          {error}
        </BodyText>
      ) : null}

      <Button
        label={loading ? t("auth.sending") : t("auth.sendCode")}
        variant="primary"
        onPress={handleSubmit}
        disabled={loading}
      />
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
    marginBottom: spacing.sm,
  },
  subtitle: {
    marginBottom: spacing.lg,
  },
  field: {
    marginBottom: spacing.md,
  },
  error: {
    marginBottom: spacing.md,
  },
});
