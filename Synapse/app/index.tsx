import useAppStore from "@/store/zustand/appStore";
import { Redirect, useRootNavigationState } from "expo-router";
import { ActivityIndicator, View } from "react-native";

export default function App() {
    const rootNavigation = useRootNavigationState();
    const user = useAppStore((state) => state.user);

    if (!rootNavigation?.key) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }
    console.log(user)

    return user && user.email ? <Redirect href="/home/(tabs)/chats" /> : <Redirect href="/auth/" />;
}
