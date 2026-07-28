import { createNativeStackNavigator } from "@react-navigation/native-stack";
import StyleGuideScreen from "../screens/StyleGuideScreen";
import { SALON_NAME } from "../constants/brand";

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="StyleGuide" component={StyleGuideScreen} options={{ title: SALON_NAME }} />
    </Stack.Navigator>
  );
}
