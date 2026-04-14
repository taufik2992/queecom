import { useState } from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, Link, type Href } from "expo-router";
import { useSignUp, useAuth } from "@clerk/expo";
import { COLORS } from "@/constants";

export default function SignUpScreen() {
  // ✅ Core 3: useSignUp returns { signUp, errors, fetchStatus }
  // isLoaded dan setActive tidak lagi digunakan langsung
  const { signUp, errors, fetchStatus } = useSignUp();
  const { isSignedIn } = useAuth();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [code, setCode] = useState("");

  // ✅ Core 3: Cek status "missing_requirements" untuk step verifikasi
  const pendingVerification =
    signUp.status === "missing_requirements" &&
    signUp.unverifiedFields?.includes("email_address") &&
    signUp.missingFields?.length === 0;

  const onSignUpPress = async () => {
    if (!emailAddress || !password) {
      Toast.show({
        type: "error",
        text1: "Missing Fields",
        text2: "Please fill in all fields",
      });
      return;
    }

    // ✅ Core 3: Gunakan signUp.password() menggantikan signUp.create()
    const { error } = await signUp.password({
      emailAddress,
      password,
      firstName,
      lastName,
    });

    if (error) {
      Toast.show({
        type: "error",
        text1: "Failed to Sign Up",
        text2: error?.message ?? "Something went wrong",
      });
      return;
    }

    // ✅ Core 3: Kirim kode verifikasi email
    await signUp.verifications.sendEmailCode();
  };

  const onVerifyPress = async () => {
    if (!code) {
      Toast.show({
        type: "error",
        text1: "Missing Fields",
        text2: "Enter verification code",
      });
      return;
    }

    // ✅ Core 3: Verifikasi email via signUp.verifications.verifyEmailCode()
    await signUp.verifications.verifyEmailCode({ code });

    if (signUp.status === "complete") {
      // ✅ Core 3: Finalisasi sign-up dengan navigate callback
      await signUp.finalize({
        navigate: ({ session, decorateUrl }) => {
          if (session?.currentTask) {
            console.log("Session task:", session.currentTask);
            return;
          }
          const url = decorateUrl("/");
          router.replace(url as Href);
        },
      });
    } else {
      const errorMsg =
        errors?.fields?.code?.message ?? "Verification incomplete";
      Toast.show({
        type: "error",
        text1: "Verification Error",
        text2: errorMsg,
      });
    }
  };

  // Jika sudah sign-in, tidak tampilkan apapun (redirect ditangani layout)
  if (signUp.status === "complete" || isSignedIn) {
    return null;
  }

  return (
    <SafeAreaView
      className="flex-1 bg-white justify-center"
      style={{ padding: 28 }}
    >
      {!pendingVerification ? (
        <>
          <TouchableOpacity
            onPress={() => router.push("/")}
            className="absolute top-12 z-10 px-4"
          >
            <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
          </TouchableOpacity>

          {/* Header */}
          <View className="items-center mb-8">
            <Text className="text-3xl font-bold text-primary mb-2">
              Create Account
            </Text>
            <Text className="text-secondary">Sign up to get started</Text>
          </View>

          {/* First Name */}
          <View className="mb-4">
            <Text className="text-primary font-medium mb-2">First Name</Text>
            <TextInput
              className="w-full bg-surface p-4 rounded-xl text-primary"
              placeholder="John"
              placeholderTextColor="#999"
              value={firstName}
              onChangeText={setFirstName}
            />
          </View>

          {/* Last Name */}
          <View className="mb-4">
            <Text className="text-primary font-medium mb-2">Last Name</Text>
            <TextInput
              className="w-full bg-surface p-4 rounded-xl text-primary"
              placeholder="Doe"
              placeholderTextColor="#999"
              value={lastName}
              onChangeText={setLastName}
            />
          </View>

          {/* Email */}
          <View className="mb-4">
            <Text className="text-primary font-medium mb-2">Email</Text>
            <TextInput
              className="w-full bg-surface p-4 rounded-xl text-primary"
              placeholder="user@example.com"
              placeholderTextColor="#999"
              autoCapitalize="none"
              keyboardType="email-address"
              value={emailAddress}
              onChangeText={setEmailAddress}
            />
            {/* ✅ Core 3: Error handling via errors.fields */}
            {errors?.fields?.emailAddress && (
              <Text className="text-red-500 text-xs mt-1">
                {errors.fields.emailAddress.message}
              </Text>
            )}
          </View>

          {/* Password */}
          <View className="mb-6">
            <Text className="text-primary font-medium mb-2">Password</Text>
            <TextInput
              className="w-full bg-surface p-4 rounded-xl text-primary"
              placeholder="********"
              placeholderTextColor="#999"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
            {errors?.fields?.password && (
              <Text className="text-red-500 text-xs mt-1">
                {errors.fields.password.message}
              </Text>
            )}
          </View>

          {/* Submit */}
          {/* ✅ Core 3: fetchStatus === "fetching" untuk loading state */}
          <TouchableOpacity
            className={`w-full py-4 rounded-full items-center mb-10 ${
              fetchStatus === "fetching" ? "bg-gray-300" : "bg-primary"
            }`}
            onPress={onSignUpPress}
            disabled={fetchStatus === "fetching"}
          >
            {fetchStatus === "fetching" ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white font-bold text-lg">Continue</Text>
            )}
          </TouchableOpacity>

          {/* Footer */}
          <View className="flex-row justify-center">
            <Text className="text-secondary">Already have an account? </Text>
            <Link href="/auth/sign-in">
              <Text className="text-primary font-bold">Login</Text>
            </Link>
          </View>

          {/* ✅ Core 3: Wajib ada untuk bot protection (CAPTCHA) */}
          <View nativeID="clerk-captcha" />
        </>
      ) : (
        <>
          <TouchableOpacity
            onPress={() => router.back()}
            className="absolute top-12 z-10 px-4"
          >
            <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
          </TouchableOpacity>

          {/* Verification */}
          <View className="items-center mb-8">
            <Text className="text-3xl font-bold text-primary mb-2">
              Verify Email
            </Text>
            <Text className="text-secondary text-center">
              Enter the code sent to your email
            </Text>
          </View>

          <View className="mb-6">
            <TextInput
              className="w-full bg-surface p-4 rounded-xl text-primary text-center tracking-widest"
              placeholder="123456"
              placeholderTextColor="#999"
              keyboardType="number-pad"
              value={code}
              onChangeText={setCode}
            />
            {errors?.fields?.code && (
              <Text className="text-red-500 text-xs mt-1 text-center">
                {errors.fields.code.message}
              </Text>
            )}
          </View>

          <TouchableOpacity
            className={`w-full py-4 rounded-full items-center mb-4 ${
              fetchStatus === "fetching" ? "bg-gray-300" : "bg-primary"
            }`}
            onPress={onVerifyPress}
            disabled={fetchStatus === "fetching"}
          >
            {fetchStatus === "fetching" ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white font-bold text-lg">Verify</Text>
            )}
          </TouchableOpacity>

          {/* ✅ Core 3: Tombol kirim ulang kode */}
          <Pressable
            className="w-full py-3 rounded-full items-center"
            onPress={() => signUp.verifications.sendEmailCode()}
          >
            <Text className="text-primary font-medium">Kirim ulang kode</Text>
          </Pressable>
        </>
      )}
    </SafeAreaView>
  );
}
