import Button from "@/components/Button";
import Header from "@/components/Header";
import InputLabel from "@/components/InputLabel";
import { registerUser } from "@/src/api/Auth";
import { COLORS } from "@/constants/Colors";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";

const RegisterPage = () => {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegisterUser = async () => {
    setLoading(true);

    try {
      const response = await registerUser({ email, username, password });
      if (response.statusCode === 200 || response.success) {
        Alert.alert(response.message || "Registration Successfull");
        router.push("/");
      } else {
        Alert.alert(response.message || "Registration failed");
      }
    } catch (error: any) {
      console.error("LOGIN ERROR:", error);
      const msg = error?.response?.data?.message;
      Alert.alert(msg);
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = username && password && email;
  const isDisabled = !isFormValid || loading;

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
        onPress={handleRegisterUser}
        style={[
          styles.signUpBtn,
          isDisabled
            ? { backgroundColor: COLORS.disabled }
            : { backgroundColor: COLORS.enabled },
        ]}
        textStyle={styles.signUpBtnText}
        disabled={isDisabled}
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
