import { useState } from "react";
import { View, StyleSheet } from "react-native";
import { colors, spacing } from "../theme";
import { useTranslation } from "../i18n/LanguageContext";
import { useAuth } from "../auth/AuthContext";
import { apiFetch, ApiError } from "../services/api";
import Heading from "../components/Heading";
import BodyText from "../components/BodyText";
import TextField from "../components/TextField";
import Button from "../components/Button";

export default function OtpVerifyScreen({ route, navigation }) {
  const { phone } = route.params;
  const { t } = useTranslation();
  const { login } = useAuth();
  const [code, setCode] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError(null);
    setLoading(true);
    try {
      const data = await apiFetch("/auth/otp/verify", { method: "POST", body: { phone, code } });
      await login(data.token, data.client);
      navigation.replace("Profile");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : t("auth.genericError"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Heading level={2} style={styles.title}>
        {t("auth.otpTitle")}
      </Heading>
      <BodyText style={styles.subtitle}>{t("auth.otpSubtitle")}</BodyText>

      <TextField
        value={code}
        onChangeText={setCode}
        placeholder={t("auth.otpPlaceholder")}
        keyboardType="number-pad"
        maxLength={6}
        style={styles.field}
      />

      {error ? (
        <BodyText weight="semibold" style={styles.error}>
          {error}
        </BodyText>
      ) : null}

      <Button
        label={loading ? t("auth.verifying") : t("auth.verify")}
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
