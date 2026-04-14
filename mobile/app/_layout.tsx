import { Stack } from "expo-router";
import "../global.css";
import { CartProvider } from "@/context/CartContext";
import { WishListProvider } from "@/context/WishListContext";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Toast from "react-native-toast-message";
import { StatusBar } from "expo-status-bar";
import { ClerkProvider } from "@clerk/expo";
import { tokenCache } from "@clerk/expo/token-cache";

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

if (!publishableKey) {
  throw new Error("Add your Clerk Publishable Key to the .env file");
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ClerkProvider tokenCache={tokenCache} publishableKey={publishableKey}>
        <StatusBar style="dark" backgroundColor="#FFFFFF" />
        <CartProvider>
          <WishListProvider>
            <Stack
              screenOptions={{
                headerShown: false,
                contentStyle: {
                  backgroundColor: "#FFFFFF",
                },
              }}
            />
            {/* <Stack.Screen name="(tabs)" />
              <Stack.Screen name="product/[id]" />
              <Stack.Screen name="shop" />
              <Stack.Screen name="checkout" />
              <Stack.Screen name="admin" />
              <Stack.Screen name="addresses/index" />
              <Stack.Screen name="orders/index" />
              <Stack.Screen name="orders/[id]" /> */}

            <Toast />
          </WishListProvider>
        </CartProvider>
      </ClerkProvider>
    </GestureHandlerRootView>
  );
}
