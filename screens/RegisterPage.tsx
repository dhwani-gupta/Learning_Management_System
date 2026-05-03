import Button from "@/components/Button";
import Header from "@/components/Header";
import InputLabel from "@/components/InputLabel";
import { COLORS } from "@/constants/Colors";
import { registerUser } from "@/src/api/Auth";
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
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    setLoading(true);
    try {
      const response = await registerUser({
        username: username.trim(),
        email: email.trim(),
        password: password.trim(),
      });

      // Check if response indicates success (status 200 or data.statusCode === 200)
      if (response?.statusCode === 200 || response?.success) {
        Alert.alert(
          "Success",
          "User registered successfully! Redirecting to login page",
          [
            {
              text: "OK",
              onPress: () => router.replace("/"), // Redirect to login page
            },
          ],
        );
      } else {
        // Extract detailed error message
        let errorMessage = response?.message || "Registration failed";

        // If there are validation errors in the errors array
        if (
          response?.errors &&
          Array.isArray(response.errors) &&
          response.errors.length > 0
        ) {
          const errorDetails = response.errors
            .map((err: any) => {
              // Each error is an object like { "username": "Username must be lowercase" }
              const key = Object.keys(err)[0];
              return err[key];
            })
            .join("\n");
          errorMessage = errorDetails || errorMessage;
        }

        Alert.alert("Error", errorMessage);
      }
    } catch (error: any) {
      // Handle network or other errors
      let errorMessage = "An error occurred";

      // Try to extract error from response data (including validation errors)
      if (error?.response?.data) {
        const data = error.response.data;

        if (
          data.errors &&
          Array.isArray(data.errors) &&
          data.errors.length > 0
        ) {
          errorMessage = data.errors
            .map((err: any) => {
              const key = Object.keys(err)[0];
              return err[key];
            })
            .join("\n");
        } else {
          errorMessage = data.message || errorMessage;
        }
      } else if (error?.message) {
        errorMessage = error.message;
      }

      Alert.alert("Error", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Check if all fields are filled
  const isFormValid =
    username.trim() && email.trim() && password.trim() && password.length >= 6;
  const isButtonDisabled = !isFormValid || loading;

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
        label={loading ? "Signing Up..." : "Sign Up"}
        onPress={isButtonDisabled ? undefined : handleSignUp}
        style={signUpBtnStyle}
        textStyle={styles.signUpBtnText}
      />

      <View style={styles.signInRow}>
        <Text style={styles.signInText}>{" Have an account? "}</Text>
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
