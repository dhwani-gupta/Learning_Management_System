import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: "white", paddingTop: 60 },
      }}
    >
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="course-details" />
    </Stack>
  );
}
