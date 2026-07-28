import { StyleSheet, Text, View } from "react-native";

export default function PlaceholderScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Denis the BARBER</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 20,
  },
});
