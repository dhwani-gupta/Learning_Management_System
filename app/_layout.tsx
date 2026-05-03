import { COLORS } from "@/constants/Colors";
import { AuthProvider, useAuth } from "@/src/context/AuthContext";
import { Stack, useRouter } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";

function RootLayoutContent() {
  const { isLoading, isSignedIn } = useAuth();
  const router = useRouter();

  // Monitor authentication state changes and navigate accordingly
  useEffect(() => {
    if (!isLoading) {
      if (isSignedIn) {
        // User is logged in, navigate to courses
        router.replace("/(auth)/(tabs)");
      }
      // If not signed in, the conditional rendering below will show login screens
    }
  }, [isSignedIn, isLoading, router]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={COLORS.enabled} />
      </View>
    );
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: "white" },
      }}
    >
      {isSignedIn ? (
        <>
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        </>
      ) : (
        <>
          <Stack.Screen name="index" />
          <Stack.Screen name="register" />
        </>
      )}
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutContent />
    </AuthProvider>
  );
}
