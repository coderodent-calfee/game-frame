import { Stack } from "expo-router";

export default function RootLayout() {
  return <Stack screenOptions={{
    headerShown: false, // Show or hide the header
    headerStyle: { backgroundColor: "#333333" }, // Customize header background
    headerTintColor: "#FFF", // Text color in the header
    headerTitleAlign: "center"}} >
    <Stack.Screen name="index" options={{ title: "Game-Frame" }} />
    <Stack.Screen name="lobby" options={{ title: "Lobby" }} />
    <Stack.Screen name="lfg" options={{ title: "Looking For Game" }} />
  </Stack>;
}
