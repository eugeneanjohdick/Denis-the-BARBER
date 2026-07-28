import { createNativeStackNavigator } from "@react-navigation/native-stack";
import PlaceholderScreen from "../screens/PlaceholderScreen";

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Placeholder" component={PlaceholderScreen} options={{ title: "Denis the BARBER" }} />
    </Stack.Navigator>
  );
}
