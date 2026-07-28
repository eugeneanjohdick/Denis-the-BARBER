import { createNativeStackNavigator } from "@react-navigation/native-stack";
import StyleGuideScreen from "../screens/StyleGuideScreen";
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
        <Stack.Screen name="StyleGuide" component={StyleGuideScreen} options={{ title: SALON_NAME }} />
      )}
    </Stack.Navigator>
  );
}
