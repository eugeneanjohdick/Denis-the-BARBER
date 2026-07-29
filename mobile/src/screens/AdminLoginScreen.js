import { useState } from "react";
import { View, StyleSheet } from "react-native";
import { colors, spacing } from "../theme";
import { useTranslation } from "../i18n/LanguageContext";
import { useAdminAuth } from "../auth/AdminAuthContext";
import { adminLogin, ApiError } from "../services/api";
import Heading from "../components/Heading";
import BodyText from "../components/BodyText";
import TextField from "../components/TextField";
import Button from "../components/Button";

export default function AdminLoginScreen({ navigation }) {
  const { t } = useTranslation();
  const { login } = useAdminAuth();
  const [username, setUsername] = useState("");
  const [pin, setPin] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError(null);
    setLoading(true);
    try {
      const { token, staff } = await adminLogin({ username: username.trim().toUpperCase(), pin });
      await login(token, staff);
      navigation.replace("AdminHome");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : t("auth.genericError"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Heading level={2} style={styles.title}>
        {t("admin.loginTitle")}
      </Heading>
      <BodyText style={styles.subtitle}>{t("admin.loginSubtitle")}</BodyText>

      <TextField
        value={username}
        onChangeText={setUsername}
        placeholder={t("admin.usernamePlaceholder")}
        autoCapitalize="characters"
        autoCorrect={false}
        style={styles.field}
      />
      <TextField
        value={pin}
        onChangeText={setPin}
        placeholder={t("admin.pinPlaceholder")}
        secureTextEntry
        keyboardType="number-pad"
        style={styles.field}
      />

      {error ? (
        <BodyText weight="semibold" style={styles.error}>
          {error}
        </BodyText>
      ) : null}

      <Button
        label={loading ? t("admin.loggingIn") : t("admin.login")}
        variant="primary"
        onPress={handleSubmit}
        disabled={loading || !username || !pin}
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
