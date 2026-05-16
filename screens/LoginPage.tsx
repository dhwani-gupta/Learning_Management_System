import Button from "@/components/Button";
import Header from "@/components/Header";
import InputLabel from "@/components/InputLabel";
import { COLORS } from "@/constants/Colors";
import { loginUser } from "@/src/api/Auth";
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
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleLogin = async () => {
    try {
      //never trust ui only
      if (!username || !password) {
        Alert.alert("Please enter username and password");
        return;
      }
      setLoading(true);
      const response = await loginUser({ username, password });
      // you can log to understand structure
      console.log("LOGIN RESPONSE:", response);

      if (response?.statusCode === 200 || response?.success) {
        Alert.alert("Logined Successfully");
        //used setTimeout just for the time being, for checking the delay.
        setTimeout(() => {
          router.push("/course");
        }, 1000);
      } else {
        //API ERROR HANDLING
        Alert.alert(response?.message || "Login failed");
      }
    } catch (error: any) {
      console.error("LOGIN ERROR:", error);
      //HTTP ERROR HANDLING
      const message = error?.response?.data?.message || "something went wrong";
      Alert.alert(message);
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = Boolean(username && password);
  const isLoginDisabled = !isFormValid || loading;

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
          secureTextEntry={true}
        />
        <Button
          label="Forgot Password?"
          onPress={() => {}}
          style={styles.forgotBtn}
          textStyle={styles.forgotBtnText}
        />
      </View>

      <Button
        label={loading ? "Signing In..." : "Sign In"}
        onPress={handleLogin}
        disabled={isLoginDisabled}
        style={[
          styles.signInBtn,
          isLoginDisabled
            ? { backgroundColor: COLORS.disabled }
            : { backgroundColor: COLORS.enabled },
        ]}
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
