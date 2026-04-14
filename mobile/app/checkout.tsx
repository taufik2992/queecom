import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  Touchable,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useCart } from "@/context/CartContext";
import { useRouter } from "expo-router";
import { Address } from "@/constants/types";
import { dummyAddress } from "@/assets/gggg/assets";
import Toast from "react-native-toast-message";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS } from "@/constants";
import Header from "@/components/Header";
import { Ionicons } from "@expo/vector-icons";

export default function CheckOutScreen() {
  const { cartTotal } = useCart();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [pageLoading, setLoadingPage] = useState(true);

  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "stripe">("cash");

  const shipping = 2.0;
  const tax = 0;
  const total = cartTotal + shipping + tax;

  async function fetchAddresses() {
    const addresList = dummyAddress;
    if (addresList.length > 0) {
      //find default of first
      const def = addresList.find((a: any) => a.isDefault) || addresList[0];
      setSelectedAddress(def as Address);
    }
    setLoadingPage(false);
  }

  async function handlePlaceOrder() {
    if (!selectedAddress) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Please add a shipping address.",
      });
      return;
    }

    if (paymentMethod === "stripe") {
      return Toast.show({
        type: "error",
        text1: "Info",
        text2: "Stripe Not Implemented yet",
      });
    }
    //cash on delivery
    router.replace("/orders");
  }

  useEffect(() => {
    fetchAddresses();
  }, []);

  if (pageLoading) {
    return (
      <SafeAreaView className="flex-1 bg-surface justify-center items-center">
        <ActivityIndicator size="large" color={COLORS.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-surface" edges={["top"]}>
      <Header title="Checkout" showBack />

      <ScrollView className="flex-1 px-4 mt-4">
        {/* Address Sections */}
        <Text className="text-lg font-bold text-primary mb-4">
          Shipping Address
        </Text>
        {selectedAddress ? (
          <View className="bg-white p-4 rounded-xl mb-6 shadow-md">
            <View className="flex-row items-center justify-between mb-2">
              <Text className="text-base font-bold">
                {selectedAddress.type}
              </Text>
              <TouchableOpacity onPress={() => router.push("/addresses")}>
                <Text className="text-accent text-sm">Change</Text>
              </TouchableOpacity>
            </View>
            <Text>
              {selectedAddress.street}, {selectedAddress.city}
              {"\n"}
              {selectedAddress.state} - {selectedAddress.zipCode}
              {"\n"}
              {selectedAddress.country}
            </Text>
          </View>
        ) : (
          <TouchableOpacity
            onPress={() => router.push("/addresses")}
            className="bg-white p-6 rounded-xl mb-6 items-center justify-center border-dashed border-2 border-gray-100"
          >
            <Text className="text-primary font-bold">Add Address</Text>
          </TouchableOpacity>
        )}

        {/* Payment Sections */}
        <Text className="text-lg font-bold text-primary mb-4">
          Payment Method
        </Text>

        {/* Cash on Delivery Option */}
        <TouchableOpacity
          onPress={() => setPaymentMethod("cash")}
          className={`flex-row bg-white p-4 rounded-xl mb-4 shadow-sm items-center border-2 ${
            paymentMethod === "cash" ? "border-primary" : "border-transparent"
          }`}
        >
          <Ionicons
            name="cash-outline"
            size={24}
            color={COLORS.primary}
            className="mr-3"
          />
          <View className="ml-3 flex-1">
            <Text className="text-base font-bold text-primary">
              Cash on Delivery
            </Text>
            <Text className="text-secondary text-xs mt-1">
              Pay When you receive the order
            </Text>
          </View>
          {paymentMethod === "cash" && (
            <Ionicons
              name="checkmark-circle"
              size={24}
              color={COLORS.primary}
            />
          )}
        </TouchableOpacity>

        {/* Stripe Options */}
        <TouchableOpacity
          onPress={() => setPaymentMethod("stripe")}
          className={`flex-row bg-white p-4 rounded-xl mb-4 shadow-sm items-center border-2 ${
            paymentMethod === "stripe" ? "border-primary" : "border-transparent"
          }`}
        >
          <Ionicons
            name="card-outline"
            size={24}
            color={COLORS.primary}
            className="mr-3"
          />
          <View className="ml-3 flex-1">
            <Text className="text-base font-bold text-primary">
              Pay with Card
            </Text>
            <Text className="text-secondary text-xs mt-1">
              Credit or Debit Card
            </Text>
          </View>
          {paymentMethod === "stripe" && (
            <Ionicons
              name="checkmark-circle"
              size={24}
              color={COLORS.primary}
            />
          )}
        </TouchableOpacity>
      </ScrollView>

      {/* Order Summmary */}
      <View className="p-4 bg-white shadow-lg border-t border-gray-100 rounded-xl">
        <Text className="text-lg font-bold text-primary mb-4">
          Order Summary
        </Text>

        {/* Subtotal */}
        <View className="flex-row justify-between mb-2">
          <Text className="text-secondary">Subtotal</Text>
          <Text className="font-bold">${cartTotal.toFixed(2)}</Text>
        </View>
        {/* Shipping */}
        <View className="flex-row justify-between mb-2">
          <Text className="text-secondary">Shipping</Text>
          <Text className="font-bold">${shipping.toFixed(2)}</Text>
        </View>
        {/* Tax */}
        <View className="flex-row justify-between mb-4">
          <Text className="text-secondary">Tax</Text>
          <Text className="font-bold">${tax.toFixed(2)}</Text>
        </View>
        {/* Total */}
        <View className="flex-row justify-between mb-6">
          <Text className=" text-primary text-xl font-bold">Total</Text>
          <Text className="text-primary text-xl font-bold ">
            ${total.toFixed(2)}
          </Text>
        </View>
        {/* Place Order Button */}
        <TouchableOpacity
          onPress={handlePlaceOrder}
          className={`p-4 rounded-xl items-center ${loading ? "bg-gray-400" : "bg-primary"}`}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text className="text-white font-bold text-lg">Place Order</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
