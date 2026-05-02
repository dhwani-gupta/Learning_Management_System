import { COLORS } from "../constants/Colors";
import { View, Text, TextInput } from "react-native";

const InputLabel = () => {
  return (
    <View style={{ flex: 1, width: "100%" }}>
      <View style={{ marginHorizontal: 15 }}>
        <Text style={{ color: COLORS.textSecondary, fontWeight: "600" }}>
          Email Address
        </Text>
      </View>

      <TextInput
        placeholder="Email Address"
        style={{
          width: "85%",
          borderColor: "grey",
          backgroundColor: COLORS.inputBg,
          height: "8%",
          borderRadius: 50,
          justifyContent: "center",
          paddingHorizontal: "15",
          margin: 15,
        }}
      />
    </View>
  );
};

export default InputLabel;
