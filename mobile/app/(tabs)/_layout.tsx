import React from "react";
import { Tabs } from "expo-router";
import { Feather, Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants";
import { useCart } from "@/context/CartContext";
import { View } from "react-native";

export default function LayoutTabs() {
  const { cartItems } = useCart();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: "#CDCDE0",
        tabBarShowLabel: false,

        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          borderTopWidth: 1,
          borderTopColor: "#F0F0F0",
          paddingTop: 8,
          paddingBottom: 8,
          height: 60,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          headerShown: false,
          tabBarIcon: ({ color, focused, size }) => (
            <Ionicons
              color={color}
              name={focused ? "home" : "home-outline"}
              size={size}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          headerShown: false,
          tabBarIcon: ({ color, focused, size }) => (
            <View className="relative">
              <Feather
                color={color}
                name={focused ? "shopping-cart" : "shopping-cart"}
                size={size}
              />

              {cartItems.length > 0 && (
                <View className=" absolute -top-2 -right-2 bg-accent size-3 rounded-full items-center justify-center">
                  <Ionicons name="ellipse" size={6} color="white" />
                </View>
              )}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          headerShown: false,
          tabBarIcon: ({ color, focused, size }) => (
            <Ionicons
              color={color}
              name={focused ? "heart" : "heart-outline"}
              size={size}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          headerShown: false,
          tabBarIcon: ({ color, focused, size }) => (
            <Ionicons
              color={color}
              name={focused ? "person" : "person-outline"}
              size={size}
            />
          ),
        }}
      />
    </Tabs>
  );
}
