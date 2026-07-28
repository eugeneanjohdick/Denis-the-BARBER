import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screens/HomeScreen";
import LanguageSelectionScreen from "../screens/LanguageSelectionScreen";
import PhoneLoginScreen from "../screens/PhoneLoginScreen";
import OtpVerifyScreen from "../screens/OtpVerifyScreen";
import ProfileScreen from "../screens/ProfileScreen";
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
        </>
      )}
    </Stack.Navigator>
  );
}
