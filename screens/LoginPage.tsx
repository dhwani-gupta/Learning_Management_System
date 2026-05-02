import Button from "@/components/Button";
import Header from "@/components/Header";
import InputLabel from "@/components/InputLabel";
import { COLORS } from "@/constants/Colors";
import { Image, Text, TouchableOpacity, View } from "react-native";

const LoginPage = () => {
  return (
    <View style={{ flex: 1, gap: 40 }}>
      <View style={{ alignItems: "center", gap: 10 }}>
        <Image
          source={require("../assets/images/Logo.jpeg")}
          style={{ width: 80, height: 80, borderRadius: 16 }}
          resizeMode="contain"
        />
        <Text style={{ fontSize: 24, fontWeight: "700", color:COLORS.textPrimary }}>SkillNest</Text>
      </View>

      <Header title="Welcome Back!" subtitle="Enter your login information" />
      <View>
        <InputLabel label="Email Address" placeholder=" Email Address" />
        <InputLabel label="Password" placeholder="Password" />
        <Button
          label="Forgot Password?"
          onPress={() => {}}
          style={{ alignSelf: "flex-end" }}
          textStyle={{
            color: COLORS.textSecondary,
            fontFamily: "SF Pro Display",
            fontWeight: "500",
            fontSize: 14,
            textDecorationLine: "underline",
          }}
        />
      </View>

      <Button
        label="Sign In"
        onPress={() => {}}
        style={{
          backgroundColor: COLORS.disabled,
          width: 360,
          height: 50,
          marginVertical: 15,
          borderRadius: 50,
          paddingHorizontal: 15,
          justifyContent: "center",
          alignItems: "center",
        }}
        textStyle={{
          color: "white",
          fontFamily: "SF Pro Display",
          fontWeight: "600",
          fontSize: 14,
        }}
      />

      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text style={{ fontSize: 14, color:COLORS.textSecondary, fontWeight: "600",}}>{"Don't have an account? "}</Text>
        <TouchableOpacity onPress={() => {}}>
          <Text
            style={{
              fontSize: 14,
              fontWeight: "500",
              textDecorationLine: "underline",
              color: COLORS.textSecondary,
            }}
          >
            Sign Up
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LoginPage;
