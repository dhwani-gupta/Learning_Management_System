import RegisterPage from "@/screens/RegisterPage";
import { View } from "react-native";

export default function Register() {
  return (
    <View
      style={{
        flex: 1,
        paddingTop: 60,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <RegisterPage />
    </View>
  );
}
