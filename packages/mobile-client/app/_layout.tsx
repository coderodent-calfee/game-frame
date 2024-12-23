import { Stack } from "expo-router";

export default function RootLayout() {
  return <Stack screenOptions={{
    headerShown: false, // Show or hide the header
    headerStyle: { backgroundColor: "#333333" }, // Customize header background
    headerTintColor: "#FFF", // Text color in the header
    headerTitleAlign: "center"}} >
    <Stack.Screen name="index" options={{ title: "Tutti-Frutti" }} />
    <Stack.Screen name="home" options={{ title: "Home" }} />
  </Stack>;
}
