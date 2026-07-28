import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useFonts, PlayfairDisplay_400Regular, PlayfairDisplay_700Bold } from "@expo-google-fonts/playfair-display";
import { Inter_400Regular, Inter_500Medium, Inter_600SemiBold } from "@expo-google-fonts/inter";
import RootNavigator from "./src/navigation/RootNavigator";
import { colors } from "./src/theme";
import { LanguageProvider } from "./src/i18n/LanguageContext";
import { AuthProvider } from "./src/auth/AuthContext";

export default function App() {
  const [fontsLoaded] = useFonts({
    PlayfairDisplay_400Regular,
    PlayfairDisplay_700Bold,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
  });

  if (!fontsLoaded) {
    return <View style={{ flex: 1, backgroundColor: colors.offWhite }} />;
  }

  return (
    <SafeAreaProvider>
      <LanguageProvider>
        <AuthProvider>
          <NavigationContainer>
            <RootNavigator />
          </NavigationContainer>
          <StatusBar style="auto" />
        </AuthProvider>
      </LanguageProvider>
    </SafeAreaProvider>
  );
}
