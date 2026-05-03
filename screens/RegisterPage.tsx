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

const RegisterPage = () => {
  const router = useRouter();
  const { register, isLoading } = useAuth();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignUp = async () => {
    try {
      await register(username.trim(), email.trim(), password.trim());
      // Redirect to login page after successful registration
      Alert.alert(
        "Success",
        "Registration successful! Please login with your credentials.",
        [
          {
            text: "OK",
            onPress: () => router.replace("/"),
          },
        ],
      );
    } catch (error: any) {
      let errorMessage = error?.message || "Registration failed";

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

  const isFormValid =
    username.trim() && email.trim() && password.trim() && password.length >= 6;
  const isButtonDisabled = !isFormValid || isLoading;

  const signUpBtnStyle = isButtonDisabled
    ? { ...styles.signUpBtn, backgroundColor: COLORS.disabled }
    : { ...styles.signUpBtn, backgroundColor: COLORS.enabled };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>←</Text>
        </TouchableOpacity>
        <Image
          source={require("../assets/images/Logo.jpeg")}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.appName}>SkillNest</Text>
      </View>

      <Header
        title="Sign Up Account"
        subtitle="Enter your personal data to create your account"
      />
      <View>
        <InputLabel
          label="Username"
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
        />
        <InputLabel
          label="Email Address"
          placeholder="Email Address"
          value={email}
          onChangeText={setEmail}
        />
        <InputLabel
          label="Password"
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
        />
        <Header subtitle="Must contain at least 6 characters" />
      </View>

      <Button
        label={isLoading ? "Signing Up..." : "Sign Up"}
        onPress={isButtonDisabled ? undefined : handleSignUp}
        style={signUpBtnStyle}
        textStyle={styles.signUpBtnText}
      />

      <View style={styles.signInRow}>
        <Text style={styles.signInText}>{"Have an account? "}</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.signInLink}>Sign In</Text>
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
  backBtn: {
    alignSelf: "flex-start",
  },
  backBtnText: {
    fontSize: 24,
    color: COLORS.textPrimary,
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
  signUpBtn: {
    width: 360,
    height: 50,
    marginVertical: 15,
    borderRadius: 50,
    paddingHorizontal: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  signUpBtnText: {
    color: "white",
    fontWeight: "600",
    fontSize: 14,
  },
  signInRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  signInText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: "600",
  },
  signInLink: {
    fontSize: 14,
    fontWeight: "500",
    textDecorationLine: "underline",
    color: COLORS.textSecondary,
  },
});

export default RegisterPage;
