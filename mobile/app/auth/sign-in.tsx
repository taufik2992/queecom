import { COLORS } from "@/constants";
import { useSignIn } from "@clerk/expo";
import { Ionicons } from "@expo/vector-icons";
import { Link, useRouter, type Href } from "expo-router";
import * as React from "react";
import {
  Pressable,
  TextInput,
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Page() {
  // ✅ Core 3: useSignIn returns { signIn, errors, fetchStatus }
  // setActive dan isLoaded tidak lagi diperlukan di sini
  const { signIn, errors, fetchStatus } = useSignIn();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [code, setCode] = React.useState("");

  // ✅ Core 3: Cek status "needs_client_trust" untuk MFA/email code
  const needsVerification = signIn.status === "needs_client_trust";

  const onSignInPress = async () => {
    // ✅ Core 3: Gunakan signIn.password() menggantikan signIn.create()
    const { error } = await signIn.password({
      emailAddress,
      password,
    });

    if (error) {
      console.error(JSON.stringify(error, null, 2));
      return;
    }

    if (signIn.status === "complete") {
      // ✅ Core 3: Gunakan signIn.finalize() dengan navigate callback
      await signIn.finalize({
        navigate: ({ session, decorateUrl }) => {
          if (session?.currentTask) {
            console.log("Session task:", session.currentTask);
            return;
          }
          const url = decorateUrl("/");
          router.replace(url as Href);
        },
      });
    } else if (signIn.status === "needs_client_trust") {
      // ✅ Core 3: MFA — kirim email code via signIn.mfa.sendEmailCode()
      const emailCodeFactor = signIn.supportedSecondFactors?.find(
        (factor) => factor.strategy === "email_code",
      );
      if (emailCodeFactor) {
        await signIn.mfa.sendEmailCode();
      }
    } else {
      console.error("Sign-in tidak selesai:", signIn);
    }
  };

  const onVerifyPress = async () => {
    if (!code) return;

    // ✅ Core 3: Verifikasi MFA via signIn.mfa.verifyEmailCode()
    await signIn.mfa.verifyEmailCode({ code });

    if (signIn.status === "complete") {
      await signIn.finalize({
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
      console.error("Verifikasi tidak selesai:", signIn);
    }
  };

  return (
    <SafeAreaView
      className="flex-1 bg-white justify-center"
      style={{ padding: 28 }}
    >
      {!needsVerification ? (
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
              Welcome Back
            </Text>
            <Text className="text-secondary">Sign in to continue</Text>
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
            {errors?.fields?.identifier && (
              <Text className="text-red-500 text-xs mt-1">
                {errors.fields.identifier.message}
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
          {/* ✅ Core 3: Gunakan fetchStatus === "fetching" untuk loading state */}
          <Pressable
            className={`w-full py-4 rounded-full items-center mb-10 ${
              fetchStatus === "fetching" || !emailAddress || !password
                ? "bg-gray-300"
                : "bg-primary"
            }`}
            onPress={onSignInPress}
            disabled={fetchStatus === "fetching" || !emailAddress || !password}
          >
            {fetchStatus === "fetching" ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white font-bold text-lg">Sign In</Text>
            )}
          </Pressable>

          {/* Footer */}
          <View className="flex-row justify-center">
            <Text className="text-secondary">Don&apos;t have an account? </Text>
            <Link href="/auth/sign-up">
              <Text className="text-primary font-bold">Sign up</Text>
            </Link>
          </View>
        </>
      ) : (
        <>
          <TouchableOpacity
            onPress={() => signIn.reset()}
            className="absolute top-12 z-10"
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

          <Pressable
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
          </Pressable>

          {/* ✅ Core 3: Tombol kirim ulang kode */}
          <Pressable
            className="w-full py-3 rounded-full items-center"
            onPress={() => signIn.mfa.sendEmailCode()}
          >
            <Text className="text-primary font-medium">Kirim ulang kode</Text>
          </Pressable>
        </>
      )}
    </SafeAreaView>
  );
}
