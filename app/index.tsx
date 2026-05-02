import InputLabel from "@/components/InputLabel";
import LoginPage from "@/screens/LoginPage";
import { View } from "react-native";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* <InputLabel/> */}
      <LoginPage/>
    </View>
  );
}
