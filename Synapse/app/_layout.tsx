import { SplashScreen, Stack } from "expo-router";
import { useFonts } from "expo-font";
import { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { QueryClient, QueryClientProvider } from "react-query";
import { SocketProvider } from "@/sockets/useSocket";
import useAppStore from "@/store/zustand/appStore";
import { getTokenSync } from "@/store/authToken";
import { getUserData } from "@/store/userData";

let api_url = "http://192.168.29.208:3000/api";

export { api_url };

const queryClient = new QueryClient();

export default function RootLayout() {
  const setToken = useAppStore((state) => state.setToken);
  const setUser = useAppStore((state) => state.setUser);
  const token = getTokenSync();

  useEffect(() => {
    setToken(token);
  }, []);

  useEffect(() => {
    const setUserdata = async () => {
      try {
        const userData = await getUserData();
        setUser(userData);
      } catch (err) {
        console.error("Failed to load user data:", err);
      }
    };
    setUserdata();
  }, []);

  const [fontsloaded, error] = useFonts({
    black: require("../assets/fonts/static/Mulish-Black.ttf"),
    regular: require("../assets/fonts/static/Mulish-Regular.ttf"),
    bold: require("../assets/fonts/static/Mulish-Bold.ttf"),
    medium: require("../assets/fonts/static/Mulish-Medium.ttf"),
    semiBold: require("../assets/fonts/static/Mulish-SemiBold.ttf"),
  });

  useEffect(() => {
    if (fontsloaded || error) {
      SplashScreen.hideAsync();
    }
  }, [fontsloaded, error]);

  if (!fontsloaded && !error) return null;

  return (
    <SocketProvider>
      <QueryClientProvider client={queryClient}>
        <SafeAreaProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
          </Stack>
        </SafeAreaProvider>
      </QueryClientProvider>
    </SocketProvider>
  );
}
