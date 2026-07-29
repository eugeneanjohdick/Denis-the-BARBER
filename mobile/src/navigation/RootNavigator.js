import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screens/HomeScreen";
import LanguageSelectionScreen from "../screens/LanguageSelectionScreen";
import PhoneLoginScreen from "../screens/PhoneLoginScreen";
import OtpVerifyScreen from "../screens/OtpVerifyScreen";
import ProfileScreen from "../screens/ProfileScreen";
import ServiceSelectionScreen from "../screens/ServiceSelectionScreen";
import StaffSelectionScreen from "../screens/StaffSelectionScreen";
import SlotSelectionScreen from "../screens/SlotSelectionScreen";
import ConfirmationScreen from "../screens/ConfirmationScreen";
import HistoryScreen from "../screens/HistoryScreen";
import AdminLoginScreen from "../screens/AdminLoginScreen";
import AdminHomeScreen from "../screens/AdminHomeScreen";
import { SALON_NAME } from "../constants/brand";
import { useTranslation } from "../i18n/LanguageContext";

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  const { hasSelectedLanguage, t } = useTranslation();

  return (
    <Stack.Navigator>
      {!hasSelectedLanguage ? (
        <Stack.Screen name="LanguageSelection" component={LanguageSelectionScreen} options={{ headerShown: false }} />
      ) : (
        <>
          <Stack.Screen name="Home" component={HomeScreen} options={{ title: SALON_NAME }} />
          <Stack.Screen name="PhoneLogin" component={PhoneLoginScreen} options={{ title: t("auth.phoneTitle") }} />
          <Stack.Screen name="OtpVerify" component={OtpVerifyScreen} options={{ title: t("auth.otpTitle") }} />
          <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: t("profile.title") }} />
          <Stack.Screen
            name="ServiceSelection"
            component={ServiceSelectionScreen}
            options={{ title: t("service.title") }}
          />
          <Stack.Screen
            name="StaffSelection"
            component={StaffSelectionScreen}
            options={{ title: t("staff.title") }}
          />
          <Stack.Screen
            name="SlotSelection"
            component={SlotSelectionScreen}
            options={{ title: t("slot.title") }}
          />
          <Stack.Screen
            name="Confirmation"
            component={ConfirmationScreen}
            options={{ title: t("confirmation.title") }}
          />
          <Stack.Screen name="History" component={HistoryScreen} options={{ title: t("history.title") }} />
          <Stack.Screen
            name="AdminLogin"
            component={AdminLoginScreen}
            options={{ title: t("admin.loginTitle") }}
          />
          <Stack.Screen name="AdminHome" component={AdminHomeScreen} options={{ title: t("admin.homeTitle") }} />
        </>
      )}
    </Stack.Navigator>
  );
}
