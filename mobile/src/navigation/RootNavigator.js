import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screens/HomeScreen";
import LanguageSelectionScreen from "../screens/LanguageSelectionScreen";
import { SALON_NAME } from "../constants/brand";
import { useTranslation } from "../i18n/LanguageContext";

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  const { hasSelectedLanguage } = useTranslation();

  return (
    <Stack.Navigator>
      {!hasSelectedLanguage ? (
        <Stack.Screen name="LanguageSelection" component={LanguageSelectionScreen} options={{ headerShown: false }} />
      ) : (
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: SALON_NAME }} />
      )}
    </Stack.Navigator>
  );
}
