import { Text, TextInput, View } from "react-native";
import { COLORS } from "../constants/Colors";

type InputLabelProps = {
  label: string;
  placeholder: string;
};

const InputLabel = ({ label, placeholder }: InputLabelProps) => {
  return (
    <View>
      <View>
        <Text style={{ color: COLORS.textSecondary, fontWeight: "600" }}>
          {label}
        </Text>
      </View>

      <TextInput
        placeholder={placeholder}
        style={{
          backgroundColor: COLORS.inputBg,
          width: 360,
          height: 50,
          marginVertical: 15,
          borderRadius: 50,
          paddingHorizontal: 15,
        }}
      />
    </View>
  );
};

export default InputLabel;
