import { StyleSheet, Text, TextInput, View } from "react-native";
import { COLORS } from "../constants/Colors";

type InputLabelProps = {
  label: string;
  placeholder: string;
  value?: string;
  onChangeText?: (text: string) => void;
};

const InputLabel = ({
  label,
  placeholder,
  value,
  onChangeText,
}: InputLabelProps) => {
  return (
    <View>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        placeholder={placeholder}
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        autoCapitalize="none"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    color: COLORS.textSecondary,
    fontWeight: "600",
  },
  input: {
    backgroundColor: COLORS.inputBg,
    width: 360,
    height: 50,
    marginVertical: 15,
    borderRadius: 50,
    paddingHorizontal: 15,
    color: COLORS.textPrimary,
  },
});

export default InputLabel;
