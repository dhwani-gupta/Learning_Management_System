import Button from "@/components/Button";
import Header from "@/components/Header";
import InputLabel from "@/components/InputLabel";
import { COLORS } from "@/constants/Colors";
import { useAuth } from "@/src/context/AuthContext";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
    Alert,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const LoginPage = () => {
  const router = useRouter();
  const { login, isLoading } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const isFormValid = username.trim() && password.trim();
  const handelSignIn = async () => {
    try {
      await login(username.trim(), password.trim());
      // No need to manually redirect - RootLayout will handle it automatically
      // when isSignedIn state updates
      Alert.alert("Success", "Login Successfully!");
    } catch (error: any) {
      // Extract detailed error message
      let errorMessage = error?.message || "Login failed";

      // If there are validation errors in the errors array
      if (
        error?.response?.data?.errors &&
        Array.isArray(error.response.data.errors) &&
        error.response.data.errors.length > 0
      ) {
        const errorDetails = error.response.data.errors
          .map((err: any) => {
            const key = Object.keys(err)[0];
            return err[key];
          })
          .join("\n");
        errorMessage = errorDetails || errorMessage;
      }

      Alert.alert("Error", errorMessage);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          source={require("../assets/images/Logo.jpeg")}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.appName}>SkillNest</Text>
      </View>

      <Header title="Welcome Back!" subtitle="Enter your login information" />
      <View>
        <InputLabel
          label="Username"
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
        />
        <InputLabel
          label="Password"
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
        />
        <Button
          label="Forgot Password?"
          onPress={() => {}}
          style={styles.forgotBtn}
          textStyle={styles.forgotBtnText}
        />
      </View>

      <Button
        label={isLoading ? "Signing In..." : "Sign In"}
        onPress={isFormValid && !isLoading ? handelSignIn : undefined}
        style={{
          ...styles.signInBtn,
          backgroundColor:
            isFormValid && !isLoading ? COLORS.enabled : COLORS.disabled,
        }}
        textStyle={styles.signInBtnText}
      />

      <View style={styles.signUpRow}>
        <Text style={styles.signUpText}>{"Don't have an account? "}</Text>
        <TouchableOpacity onPress={() => router.push("/register")}>
          <Text style={styles.signUpLink}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 40,
  },
  logoContainer: {
    alignItems: "center",
    gap: 10,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 16,
  },
  appName: {
    fontSize: 24,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },
  forgotBtn: {
    alignSelf: "flex-end",
  },
  forgotBtnText: {
    color: COLORS.textSecondary,
    fontWeight: "500",
    fontSize: 14,
    textDecorationLine: "underline",
  },
  signInBtn: {
    width: 360,
    height: 50,
    marginVertical: 15,
    borderRadius: 50,
    paddingHorizontal: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  signInBtnText: {
    color: "white",
    fontWeight: "600",
    fontSize: 14,
  },
  signUpRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  signUpText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: "600",
  },
  signUpLink: {
    fontSize: 14,
    fontWeight: "500",
    textDecorationLine: "underline",
    color: COLORS.textSecondary,
  },
});

export default LoginPage;
