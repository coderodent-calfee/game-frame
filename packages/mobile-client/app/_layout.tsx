import { Stack } from "expo-router";
import { Slot } from "expo-router";
import { AppProvider } from "@/utils/AppContext";
import Game from "@/app/game";

export default function RootLayout() {
    const screenOptions={
        headerShown: false,
        headerStyle: { backgroundColor: "#333333" },
        headerTintColor: "#FFF",
        headerTitleAlign: "center"};
    
  return(
      <AppProvider>
          <Stack screenOptions={screenOptions} >
              <Stack.Screen name="index" options={{ title: "Game-Frame" }} />
              <Stack.Screen name="lobby" options={{ title: "Lobby" }} />
              <Stack.Screen name="lfg" options={{ title: "Looking For Game" }} />
          </Stack>
      </AppProvider> );
}
